/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"

import {
  ModelSolutionSpec,
  ModelSolutionSpecDragging,
  ModelSolutionSpecHighlighting,
  ModelSolutionSpecItem,
  ModelSolutionSpecTyping,
} from "../../protocolTypes/modelSolutionSpec"
import { isSpecRequest } from "@/shared-module/common/bindings.guard"
import {
  FeedbackMessage,
  PrivateSpec,
  PrivateSpecDragging,
  PrivateSpecHighlighting,
  PrivateSpecTyping,
} from "@/protocolTypes/privateSpec"
import { extractDraggableOptionsFromPrivateSpecItem } from "./public-spec"
import { PublicSpecOption } from "@/protocolTypes/publicSpec"
import { paragraphToHighlightableParts } from "@/util/paragraphToHighlightablePart"

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  try {
    return handleModelSolutionGeneration(req, res)
  } catch (e) {
    console.error("Model solution request failed:", e)
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

function handleModelSolutionGeneration(
  req: NextApiRequest,
  res: NextApiResponse<ModelSolutionSpec>,
) {
  if (!isSpecRequest(req.body)) {
    throw new Error("Request was not valid.")
  }
  const privateSpec = req.body.private_spec as PrivateSpec
  let spec: ModelSolutionSpec

  switch (privateSpec.exerciseType) {
    case "dragging":
      spec = makeDraggingModelSolutionSpec(privateSpec)
      break
    case "highlighting":
      spec = makeHighlightingModelSolutionSpec(privateSpec)
      break
    case "typing":
      spec = makeTypingModelSolutionSpec(privateSpec)
      break
    default:
      throw new Error(`Unsupported exercise type: ${privateSpec.exerciseType}`)
  }

  return res.status(200).json(spec)
}

export function makeDraggingModelSolutionSpec(
  privateSpec: PrivateSpecDragging,
): ModelSolutionSpecDragging {
  const itemIdTooptionsBySlot: Record<string, PublicSpecOption[]> = {}
  const itemIdToFeedbackMessages: Record<string, FeedbackMessage[]> = {}
  for (const item of privateSpec.items) {
    const options = extractDraggableOptionsFromPrivateSpecItem(
      item,
      privateSpec.secretKey,
    )
    itemIdTooptionsBySlot[item.id] = options

    itemIdToFeedbackMessages[item.id] =
      item.feedbackMessages?.filter(
        (fm) => fm.visibility === "model-solution",
      ) ?? []
  }

  return {
    version: 1,
    exerciseType: "dragging",
    itemIdTooptionsBySlot,
    itemIdToFeedbackMessages,
  }
}

export function makeHighlightingModelSolutionSpec(
  privateSpec: PrivateSpecHighlighting,
): ModelSolutionSpecHighlighting {
  const correctHighlightables: PublicSpecOption[] = []

  const splittedByParagraph = privateSpec.text.split(/\n{2,}/)

  splittedByParagraph.forEach((paragraph, paragraphNumber) => {
    // Parts here include the [] characters so that we can match the correct answer
    const parts = paragraphToHighlightableParts(
      paragraph,
      paragraphNumber,
      privateSpec.secretKey,
    )
    parts.forEach((part) => {
      const trimmed = part.text.trim()
      if (
        part.type === "highlightable" &&
        trimmed[0] === "[" &&
        trimmed[trimmed.length - 1] === "]"
      ) {
        const publicSpecOption: PublicSpecOption = {
          text: trimmed.slice(1, -1),
          id: part.id,
        }
        publicSpecOption.text = publicSpecOption.text.trim()
        correctHighlightables.push(publicSpecOption)
      }
    })
  })

  const feedbackMessages =
    privateSpec.feedbackMessages?.filter(
      (fm) => fm.visibility === "model-solution",
    ) ?? []

  return {
    version: 1,
    exerciseType: "highlighting",
    correctHighlightables,
    feedbackMessages,
  }
}

export function makeTypingModelSolutionSpec(
  privateSpec: PrivateSpecTyping,
): ModelSolutionSpecTyping {
  const items = privateSpec.items.map((item) => {
    // Extact all strings inside [] characters
    const regex = /\[([^\]]+)\]/g
    const optionsBySlot: { acceptedStrings: string[] }[] = []
    let match
    while ((match = regex.exec(item.text)) !== null) {
      const matched = match[1].trim()
      const acceptedStrings = matched.split("|").map((s) => s.trim())
      optionsBySlot.push({ acceptedStrings })
    }

    const feedbackMessages =
      item.feedbackMessages?.filter(
        (fm) => fm.visibility === "model-solution",
      ) ?? []
    return {
      id: item.id,
      optionsBySlot: optionsBySlot,
      feedbackMessages,
    } satisfies ModelSolutionSpecItem
  })

  return {
    version: 1,
    exerciseType: "typing",
    items: items,
  }
}
