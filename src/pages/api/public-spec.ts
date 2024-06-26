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
import {
  PrivateSpec,
  PrivateSpecDragging,
  PrivateSpecHighlighting,
  PrivateSpecItem,
  PrivateSpecTyping,
} from "@/protocolTypes/privateSpec"
import { oneWayStringToId } from "@/util/hashing"
import { paragraphToHighlightableParts } from "@/util/paragraphToHighlightablePart"

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
  let spec: PublicSpec
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

  return res.status(200).json(spec)
}

export function makeHighlightingPublicSpec(
  privateSpec: PrivateSpecHighlighting,
): PublicSpecHighlighting {
  const sanitizedText = privateSpec.text.replace(/\[/g, "").replace(/\]/g, "")

  const splittedByParagraph = sanitizedText.split(/\n{2,}/)

  const highligtablePartsByParagraph = splittedByParagraph.map(
    (paragraph, paragraphNumber) => {
      return {
        paragraphNumber,
        highlightableParts: paragraphToHighlightableParts(
          paragraph,
          paragraphNumber,
          privateSpec.secretKey,
        ),
      }
    },
  )

  return {
    version: 1,
    exerciseType: "highlighting",
    highligtablePartsByParagraph,
  }
}

export function makeTypingPublicSpec(
  privateSpec: PrivateSpecTyping,
): PublicSpecTyping {
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

export function extractDraggableOptionsFromPrivateSpecItem(
  item: PrivateSpecItem,
  secretKey: string,
): PublicSpecOption[] {
  // Options can be found inside the template text inside square brackets
  // e.g. if the text is "I [went] to the store yesterday and [bought] some groceries." then the options are "went" and "bought"
  const options = item.text.match(/\[([^\]]+)\]/g)
  if (!options) {
    return []
  }
  return options.map((option, n) => {
    // The id should stay the same as long as it's the sane nth option of the item
    // It also needs not to be reversible so that we don't leak the correct answer
    const id = oneWayStringToId(`${n}-${item.id}`, item.id, secretKey)
    return { id, text: option.slice(1, -1) } satisfies PublicSpecOption
  })
}

export function makeDraggingPublicSpec(
  privateSpec: PrivateSpecDragging,
): PublicSpecDragging {
  const allOptions = privateSpec.items
    .flatMap((item) => {
      return extractDraggableOptionsFromPrivateSpecItem(
        item,
        privateSpec.secretKey,
      )
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
