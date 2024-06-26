/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"

import { isSpecRequest } from "@/shared-module/common/bindings.guard"
import {
  PublicSpec,
  PublicSpecDragging,
  PublicSpecHighlighting,
  PublicSpecOption,
  PublicSpecTyping,
  TextPart,
} from "@/protocolTypes/publicSpec"
import { v5 } from "uuid"
import { PrivateSpec, PrivateSpecDragging, PrivateSpecHighlighting, PrivateSpecTyping } from "@/protocolTypes/privateSpec"
import { blake3 } from "@noble/hashes/blake3"
import { hexToUint8Array } from "@/util/keys"

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" })
  }

  try {
    return handlePost(req, res)
  } catch (e) {
    console.error("Public spec request failed:", e)
    if (e instanceof Error) {
      return res.status(500).json({
        error_name: e.name,
        error_message: e.message,
        error_stack: e.stack,
      })
    } else {
      return res.status(500).json({ error_message: e })
    }
  }
}

function handlePost(req: NextApiRequest, res: NextApiResponse) {
  if (isSpecRequest(req.body.private_spec)) {
    throw new Error("Invalid request")
  }
  const privateSpec = req.body.private_spec as PrivateSpec
  let spec: PublicSpec | null = null
  switch (privateSpec.exerciseType) {
    case "dragging":
      spec = makeDraggingPublicSpec(privateSpec)
      break
    case "highlighting":
      spec = makeHighlightingPublicSpec(privateSpec)
      break
    case "typing":
      spec = makeTypingPublicSpec(privateSpec)
      break
    default:
      throw new Error(`Unsupported exercise type: ${privateSpec.exerciseType}`)
  }

  if (!spec) {
    throw new Error("Failed to create public spec.")
  }
  return res.status(200).json(spec)
}

function makeHighlightingPublicSpec(
  privateSpec: PrivateSpecHighlighting,
): PublicSpecHighlighting {

  const sanitizedText = privateSpec.text.replace(/\[/g, "").replace(/\]/g, "");

  return {
    version: 1,
    exerciseType: "highlighting",
    text: sanitizedText,
  }
}

function makeTypingPublicSpec(privateSpec: PrivateSpecTyping): PublicSpecTyping {
  const sanitizedItems = privateSpec.items.map((item) => {
    const text = item.text
    const parts = transformText(text)
    return {
      id: item.id,
      text: parts,
    }
  })
  return {
    version: 1,
    exerciseType: "typing",
    items: sanitizedItems,
  }
}


function makeDraggingPublicSpec(
  privateSpec: PrivateSpecDragging,
): PublicSpecDragging {
  const allOptions = privateSpec.items
    .flatMap((item) => {
      const templateText = item.text
      // Options can be found inside the template text inside square brackets
      // e.g. if the text is "I [went] to the store yesterday and [bought] some groceries." then the options are "went" and "bought"
      const options = templateText.match(/\[([^\]]+)\]/g)
      if (!options) {
        return []
      }
      return options.map((option, n) => {
        // Creating a deterministic id for each option by using a one way cryptographic hash function to prevent leaking the correct answers
        // It uses the random string privateSpec.secretKey to ensure that the id cannot be brute forced
        const hash = blake3(`${n}-${item.id}`, {
          dkLen: 256,
          key: hexToUint8Array(privateSpec.secretKey),
        })
        // Uuid v5 is a convenient way to convert the uint8array to a string that is useable as an id. Actual security is provided by the blake3 hash.
        const id = v5(hash, item.id)
        return { id, text: option.slice(1, -1) } satisfies PublicSpecOption
      })
    })
    .sort((a, b) => a.text.localeCompare(b.text))

  const sanitizedItems = privateSpec.items.map((item) => {
    const text = item.text
    const parts = transformText(text)
    return {
      id: item.id,
      text: parts,
    }
  })
  return {
    version: 1,
    exerciseType: "dragging",
    items: sanitizedItems,
    allOptions: allOptions,
  }
}

function transformText(input: string): TextPart[] {
  const regex = /\[(.*?)\]|([^[\]]+)/g
  const result: TextPart[] = []
  let match

  while ((match = regex.exec(input)) !== null) {
    if (match[1]) {
      // Matched content inside brackets
      result.push({ type: "slot" })
    } else if (match[2]) {
      // Matched content outside brackets
      result.push({ type: "text", text: match[2].trim() })
    }
  }

  return result
}
