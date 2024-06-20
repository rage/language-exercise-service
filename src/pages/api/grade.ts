/* eslint-disable i18next/no-literal-string */
import type { NextApiRequest, NextApiResponse } from "next"

import { UserAnswer } from "../../protocolTypes/answer"
import { PrivateSpec } from "../../protocolTypes/privateSpec"

import { ExerciseTaskGradingResult } from "@/shared-module/common/bindings"
import { GradingRequest as GenericGradingRequest } from "@/shared-module/common/exercise-service-protocol-types-2"
import { isNonGenericGradingRequest } from "@/shared-module/common/exercise-service-protocol-types.guard"

type GradingRequest = GenericGradingRequest<PrivateSpec, UserAnswer>

const handleGradingRequest = (
  req: NextApiRequest,
  res: NextApiResponse<ExerciseTaskGradingResult>,
): void => {
  // Validate grading request
  if (!isNonGenericGradingRequest(req.body)) {
    throw new Error("Invalid grading request")
  }
  // @ts-expect-error: TODO: will use these in the future
  const { exercise_spec, submission_data } = req.body as GradingRequest

  const responseJson: ExerciseTaskGradingResult = {
    feedback_json: null,
    feedback_text: null,
    grading_progress: "FullyGraded",
    score_given: 1,
    score_maximum: 1,
  }

  return res.status(200).json(responseJson)
}

/**
 * Handle grading requests
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" })
  }

  try {
    return handleGradingRequest(req, res)
  } catch (e) {
    console.error("Grading request failed:", e)
    if (e instanceof Error) {
      return res.status(500).json({
        error_name: e.name,
        error_message: e.message,
        error_stack: e.stack,
      })
    }
  }
}
