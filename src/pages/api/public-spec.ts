/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"

import { isSpecRequest } from "@/shared-module/common/bindings.guard"
import { PublicSpec, TextPart } from "@/protocolTypes/publicSpec"
import { v4 } from "uuid"
import { PrivateSpec } from "@/protocolTypes/privateSpec"
import { shuffle } from "lodash"

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
  if (privateSpec.exerciseType !== "dragging") {
    throw new Error("Unsupported exercise type")
  }
  const allOptions = privateSpec.items
    .flatMap((item) => {
      const templateText = item.text
      // Options can be found inside the template text inside square brackets
      // e.g. if the text is "I [went] to the store yesterday and [bought] some groceries." then the options are "went" and "bought"
      const options = templateText.match(/\[([^\]]+)\]/g)
      if (!options) {
        return []
      }
      return options.map((option) => option.slice(1, -1))
    })
    .sort((a, b) => a.localeCompare(b))

  // export type TextPart = { type: "text"; text: string } | { type: "slot" }
  const sanitizedItems = privateSpec.items.map((item) => {
    const text = item.text
    const parts = transformText(text)
    return {
      id: item.id,
      text: parts,
    }
  })

  return res.status(200).json({
    version: 1,
    exerciseType: "dragging",
    items: sanitizedItems,
    allOptions: allOptions,
  })
}

function transformText(input: string): TextPart[] {
  const regex = /\[(.*?)\]|([^\[\]]+)/g
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
