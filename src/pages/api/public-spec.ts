/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"

import { OldQuiz } from "../../../types/oldQuizTypes"
import { PrivateSpec } from "../../protocolTypes/privateSpec"
import { convertPublicSpecFromPrivateSpec } from "../../util/converter"
import { isOldQuiz } from "../../util/migration/migrationSettings"
import { migratePrivateSpec } from "../../util/migration/PrivateSpec"

import { isSpecRequest } from "@/shared-module/common/bindings.guard"

export default (req: NextApiRequest, res: NextApiResponse): void => {
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
  const specRequest = req.body
  const quiz = specRequest.private_spec as OldQuiz | PrivateSpec | null
  if (quiz === null) {
    throw new Error("Quiz cannot be null")
  }
  let converted: PrivateSpec | null = null
  if (isOldQuiz(quiz)) {
    converted = migratePrivateSpec(quiz as OldQuiz)
  } else {
    converted = quiz as PrivateSpec
  }
  const PublicSpec = convertPublicSpecFromPrivateSpec(converted)
  return res.status(200).json(PublicSpec)
}
