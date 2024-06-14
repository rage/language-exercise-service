/* eslint-disable i18next/no-literal-string */
import type { NextApiRequest, NextApiResponse } from "next"

import { UserAnswer } from "../../protocolTypes/answer"
import { ItemAnswerFeedback } from "../../protocolTypes/grading"
import { PrivateSpec } from "../../protocolTypes/privateSpec"
import { assessAnswers } from "../../grading/assessment"
import { submissionFeedback } from "../../grading/feedback"
import { gradeAnswers } from "../../grading/grading"
import { handlePrivateSpecMigration, handleUserAnswerMigration } from "../../grading/utils"

import { ExerciseTaskGradingResult } from "@/shared-module/common/bindings"
import { GradingRequest } from "@/shared-module/common/exercise-service-protocol-types-2"
import { isNonGenericGradingRequest } from "@/shared-module/common/exercise-service-protocol-types.guard"
import { nullIfEmptyString } from "@/shared-module/common/utils/strings"

type GradingRequest = GradingRequest<PrivateSpec, UserAnswer>

const handleGradingRequest = (
  req: NextApiRequest,
  res: NextApiResponse<ExerciseTaskGradingResult>,
): void => {
  // Validate grading request
  if (!isNonGenericGradingRequest(req.body)) {
    throw new Error("Invalid grading request")
  }
  const { exercise_spec, submission_data } = req.body as GradingRequest

  // Migrate to newer version
  const PrivateSpec = handlePrivateSpecMigration(exercise_spec)
  const userAnswer = handleUserAnswerMigration(PrivateSpec, submission_data)

  // Generate feedbacks
  const assessedAnswers = assessAnswers(userAnswer, PrivateSpec)
  const score = gradeAnswers(assessedAnswers, PrivateSpec)
  const feedbacks: ItemAnswerFeedback[] = submissionFeedback(
    submission_data,
    exercise_spec,
    assessedAnswers,
  )

  const responseJson: ExerciseTaskGradingResult = {
    feedback_json: feedbacks,
    feedback_text: nullIfEmptyString(exercise_spec.submitMessage),
    grading_progress: "FullyGraded",
    score_given: score,
    score_maximum: exercise_spec.items.length,
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
