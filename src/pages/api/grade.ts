/* eslint-disable i18next/no-literal-string */
import type { NextApiRequest, NextApiResponse } from "next"

import {
  UserAnswer,
  UserAnswerDragging,
  UserAnswerHighlighting,
  UserAnswerTyping,
} from "../../protocolTypes/answer"
import {
  PrivateSpec,
  PrivateSpecDragging,
  PrivateSpecHighlighting,
  PrivateSpecTyping,
} from "../../protocolTypes/privateSpec"

import { ExerciseTaskGradingResult } from "@/shared-module/common/bindings"
import { GradingRequest as GenericGradingRequest } from "@/shared-module/common/exercise-service-protocol-types-2"
import { isNonGenericGradingRequest } from "@/shared-module/common/exercise-service-protocol-types.guard"
import {
  makeDraggingPublicSpec,
  makeHighlightingPublicSpec,
} from "./public-spec"
import { PublicSpecOption } from "@/protocolTypes/publicSpec"

type GradingRequest = GenericGradingRequest<PrivateSpec, UserAnswer>

const handleGradingRequest = (
  req: NextApiRequest,
  res: NextApiResponse<ExerciseTaskGradingResult>,
): void => {
  // Validate grading request
  if (!isNonGenericGradingRequest(req.body)) {
    throw new Error("Invalid grading request")
  }
  const { exercise_spec, submission_data } = req.body as GradingRequest

  let responseJson: ExerciseTaskGradingResult

  switch (exercise_spec.exerciseType) {
    case "typing":
      if (submission_data.exerciseType !== "typing") {
        throw new Error("Invalid submission data")
      }
      responseJson = handleTypingGradingRequest(exercise_spec, submission_data)
      break
    case "highlighting":
      if (submission_data.exerciseType !== "highlighting") {
        throw new Error("Invalid submission data")
      }
      responseJson = handleHighlightingGradingRequest(
        exercise_spec,
        submission_data,
      )
      break
    case "dragging":
      if (submission_data.exerciseType !== "dragging") {
        throw new Error("Invalid submission data")
      }
      responseJson = handleDraggingGradingRequest(
        exercise_spec,
        submission_data,
      )
      break
    default:
      throw new Error("Unsupported exercise type")
  }

  return res.status(200).json(responseJson)
}

function handleDraggingGradingRequest(
  exerciseSpec: PrivateSpecDragging,
  submissionData: UserAnswerDragging,
): ExerciseTaskGradingResult {
  const publicSpec = makeDraggingPublicSpec(exerciseSpec)
  let numCorrect = 0
  let numIncorrect = 0
  for (const item of exerciseSpec.items) {
    const publicSpecForItem = publicSpec.items.find((i) => i.id === item.id)
    if (!publicSpecForItem) {
      throw new Error(
        "Parsing the exercise configuration produced an illegal state",
      )
    }
    const itemAnswerForItem = submissionData.itemAnswers.find(
      (ia) => ia.itemId === item.id,
    )
    if (!itemAnswerForItem) {
      console.warn(
        `No answer for item ${item.id}. Marking all the slots in this item as incorrect.`,
      )
      numIncorrect += publicSpecForItem.textParts.filter(
        (tp) => tp.type === "slot",
      ).length
      continue
    }

    let nthSlot = -1
    for (const textPart of publicSpecForItem.textParts) {
      if (textPart.type !== "slot") {
        continue
      }
      nthSlot += 1
      const selectedOption = itemAnswerForItem.selectedOptions[nthSlot]
      if (!selectedOption) {
        console.warn(
          `No answer for slot ${nthSlot} in item ${item.id}. Marking this slot as incorrect.`,
        )
        numIncorrect += 1
        continue
      }
      // TODO: Implement finding the correct option
      const correctOption = null as any as PublicSpecOption
      // We check correctness both by the option id and the option text during submission so that the grading is fair even if the exercise has been updated after the submission.
      const acceptableAnswers = [correctOption.text]
      const sameOptionFoundById = publicSpec.allOptions.find(
        (o) => o.id === correctOption.id,
      )
      if (sameOptionFoundById) {
        acceptableAnswers.push(sameOptionFoundById.text)
      }
      // If the selected option is in the list of correct options, we mark the slot as correct.
      if (
        acceptableAnswers
          .map((s) => s.trim())
          .includes(selectedOption.text.trim())
      ) {
        numCorrect += 1
      } else {
        numIncorrect += 1
      }
    }
  }
  return {
    grading_progress: "FullyGraded",
    score_given: numCorrect / (numCorrect + numIncorrect),
    score_maximum: 1,
    feedback_text: null,
    feedback_json: {},
  }
}

function handleHighlightingGradingRequest(
  exerciseSpec: PrivateSpecHighlighting,
  submissionData: UserAnswerHighlighting,
): ExerciseTaskGradingResult {
  const publicSpec = makeHighlightingPublicSpec(exerciseSpec)
  const numCorrect = 0
  const numIncorrect = 0
  for (const paragraph of publicSpec.highligtablePartsByParagraph) {
    for (const hightlightablePart of paragraph.highlightableParts) {
      if (hightlightablePart.type === "non-highlightable") {
        continue
      }
    }
  }

  return {
    grading_progress: "FullyGraded",
    score_given: numCorrect / (numCorrect + numIncorrect),
    score_maximum: 1,
    feedback_text: null,
    feedback_json: {},
  }
}

function handleTypingGradingRequest(
  exerciseSpec: PrivateSpecTyping,
  submissionData: UserAnswerTyping,
): ExerciseTaskGradingResult {
  // TODO
  return {
    grading_progress: "FullyGraded",
    score_given: 0,
    score_maximum: 1,
    feedback_text: null,
    feedback_json: {},
  }
}

/**
 * Handle grading requests
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
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
