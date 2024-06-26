/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"

import { ModelSolutionSpec } from "../../protocolTypes/modelSolutionSpec"
import { isSpecRequest } from "@/shared-module/common/bindings.guard"
import {
  PrivateSpec,
  PrivateSpecDragging,
  PrivateSpecHighlighting,
  PrivateSpecTyping,
} from "@/protocolTypes/privateSpec"
import {
  extractDraggableOptionsFromPrivateSpecItem,
  makeDraggingPublicSpec,
  makeHighlightingPublicSpec,
  makeTypingPublicSpec,
} from "./public-spec"
import { PublicSpecOption } from "@/protocolTypes/publicSpec"

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

function makeDraggingModelSolutionSpec(
  privateSpec: PrivateSpecDragging,
): ModelSolutionSpec {
  const itemIdToCorrectOptions: Record<string, PublicSpecOption[]> = {}
  for (const item of privateSpec.items) {
    const options = extractDraggableOptionsFromPrivateSpecItem(
      item,
      privateSpec.secretKey,
    )
    itemIdToCorrectOptions[item.id] = options
  }
  return {
    version: 1,
    exerciseType: "dragging",
    itemIdToCorrectOptions,
  }
}

function makeHighlightingModelSolutionSpec(
  privateSpec: PrivateSpecHighlighting,
): ModelSolutionSpec {
  const publicSpec = makeHighlightingPublicSpec(privateSpec)
  return {
    version: 1,
    exerciseType: "highlighting",
    highlightableIdToCorrectOption: {},
  }
}

function makeTypingModelSolutionSpec(
  privateSpec: PrivateSpecTyping,
): ModelSolutionSpec {
  const publicSpec = makeTypingPublicSpec(privateSpec)
  return {
    version: 1,
    exerciseType: "typing",
    items: [],
  }
}
