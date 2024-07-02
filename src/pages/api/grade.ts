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
import { makeDraggingPublicSpec } from "./public-spec"
import {
  makeDraggingModelSolutionSpec,
  makeHighlightingModelSolutionSpec,
  makeTypingModelSolutionSpec,
} from "./model-solution"
import {
  GradingCorrectness,
  GradingDragging,
  GradingHighlighting,
  GradingInfo,
  GradingTyping,
} from "@/protocolTypes/grading"
import { pickBestFeedbackForGrading } from "@/util/feedback"

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
  const modelSolutionSpec = makeDraggingModelSolutionSpec(exerciseSpec)
  let numCorrect = 0
  let numIncorrect = 0
  const itemIdToGradingInfo: Record<string, GradingInfo> = {}

  for (const item of exerciseSpec.items) {
    const publicSpecForItem = publicSpec.items.find((i) => i.id === item.id)
    const modelSolutionSpecForItem =
      modelSolutionSpec.itemIdTooptionsBySlot[item.id]
    if (!publicSpecForItem || !modelSolutionSpecForItem) {
      throw new Error(
        "Parsing the exercise configuration produced an illegal state",
      )
    }
    const slotsCount = publicSpecForItem.textParts.filter(
      (o) => o.type === "slot",
    ).length
    const nthWasCorrect: boolean[] = new Array(slotsCount).fill(false)
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
      itemIdToGradingInfo[item.id] = {
        correctness: "incorrect",
        feedbackMessage: null,
        nthWasCorrect,
      }
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
        nthWasCorrect[nthSlot] = false
        continue
      }
      const correctOption = modelSolutionSpecForItem[nthSlot]
      if (!correctOption) {
        throw new Error(
          "Parsing the exercise configuration produced an illegal state",
        )
      }
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
        nthWasCorrect[nthSlot] = true
      } else {
        numIncorrect += 1
        nthWasCorrect[nthSlot] = false
      }
    }
    let correctness: GradingCorrectness
    if (numCorrect > 0 && numIncorrect === 0) {
      correctness = "correct"
    } else if (numCorrect > 0 && numIncorrect > 0) {
      correctness = "partially-correct"
    } else {
      correctness = "incorrect"
    }
    itemIdToGradingInfo[item.id] = {
      correctness,
      feedbackMessage: pickBestFeedbackForGrading(
        item.feedbackMessages ?? [],
        correctness,
      ),
      nthWasCorrect,
    }
  }

  const feedbackJson: GradingDragging = {
    version: 1,
    exerciseType: "dragging",
    itemIdToGradingInfo,
  }
  return {
    grading_progress: "FullyGraded",
    score_given: numCorrect / (numCorrect + numIncorrect),
    score_maximum: 1,
    feedback_text: null,
    feedback_json: feedbackJson,
  }
}

function handleHighlightingGradingRequest(
  exerciseSpec: PrivateSpecHighlighting,
  submissionData: UserAnswerHighlighting,
): ExerciseTaskGradingResult {
  const modelSolutionSpec = makeHighlightingModelSolutionSpec(exerciseSpec)
  const answerLength = submissionData.selectedWords.length
  const nthWasCorrect: boolean[] = new Array(answerLength).fill(false)
  let numCorrect = 0
  let numIncorrect = 0

  const seenHighligtableIds = new Set<string>()

  for (const highlightable of modelSolutionSpec.correctHighlightables) {
    seenHighligtableIds.add(highlightable.id)
    const index = submissionData.selectedWords.findIndex(
      (sw) => sw.id === highlightable.id,
    )
    if (index !== -1) {
      numCorrect += 1
      nthWasCorrect[index] = true
    } else {
      numIncorrect += 1
    }
  }

  // Penalize for selecting extra words
  for (const selectedWord of submissionData.selectedWords) {
    if (!seenHighligtableIds.has(selectedWord.id)) {
      numIncorrect += 1
    }
  }

  let correctness: GradingCorrectness
  if (numCorrect > 0 && numIncorrect === 0) {
    correctness = "correct"
  } else if (numCorrect > 0 && numIncorrect > 0) {
    correctness = "partially-correct"
  } else {
    correctness = "incorrect"
  }

  const feedbackJson: GradingHighlighting = {
    version: 1,
    exerciseType: "highlighting",
    gradingInfo: {
      correctness,
      feedbackMessage: pickBestFeedbackForGrading(
        exerciseSpec.feedbackMessages ?? [],
        correctness,
      ),
      nthWasCorrect,
    },
  }

  return {
    grading_progress: "FullyGraded",
    score_given: numCorrect / (numCorrect + numIncorrect),
    score_maximum: 1,
    feedback_text: null,
    feedback_json: feedbackJson,
  }
}

function handleTypingGradingRequest(
  exerciseSpec: PrivateSpecTyping,
  submissionData: UserAnswerTyping,
): ExerciseTaskGradingResult {
  const publicSpec = makeTypingModelSolutionSpec(exerciseSpec)
  const modelSolutionSpec = makeTypingModelSolutionSpec(exerciseSpec)
  let numCorrect = 0
  let numIncorrect = 0

  const itemIdToGradingInfo: Record<string, GradingInfo> = {}

  for (const item of exerciseSpec.items) {
    const publicSpecForItem = publicSpec.items.find((i) => i.id === item.id)
    const slotsCount = publicSpecForItem?.optionsBySlot.length
    const nthWasCorrect: boolean[] = new Array(slotsCount).fill(false)
    const correctAnswers = modelSolutionSpec.items.find((i) => i.id === item.id)
    if (!correctAnswers) {
      throw new Error(
        "Parsing the exercise configuration produced an illegal state",
      )
    }
    const userAnswer = submissionData.itemAnswers.find(
      (ia) => ia.itemId === item.id,
    )
    if (!userAnswer) {
      console.warn(
        `No answer for item ${item.id}. Marking all the slots in this item as incorrect.`,
      )
      numIncorrect += correctAnswers.optionsBySlot.length
      itemIdToGradingInfo[item.id] = {
        correctness: "incorrect",
        feedbackMessage: null,
        nthWasCorrect,
      }
      continue
    }
    let answerIndex = -1
    for (const correctAnswersBySlot of correctAnswers.optionsBySlot) {
      answerIndex += 1
      const userAnswerBySlot = userAnswer.answers[answerIndex]
      if (!userAnswerBySlot) {
        console.warn(
          `No answer for slot ${correctAnswersBySlot}. Marking this slot as incorrect.`,
        )
        numIncorrect += 1
        nthWasCorrect[answerIndex] = false
        continue
      }
      if (exerciseSpec.matchingIsCaseInsensitive) {
        if (
          correctAnswersBySlot.acceptedStrings
            .map((s) => s.toLowerCase())
            .includes(userAnswerBySlot.trim().toLowerCase())
        ) {
          numCorrect += 1
        }
      } else if (
        correctAnswersBySlot.acceptedStrings.includes(userAnswerBySlot.trim())
      ) {
        numCorrect += 1
        nthWasCorrect[answerIndex] = true
      } else {
        numIncorrect += 1
        nthWasCorrect[answerIndex] = false
      }
    }

    let correctness: GradingCorrectness
    if (numCorrect > 0 && numIncorrect === 0) {
      correctness = "correct"
    } else if (numCorrect > 0 && numIncorrect > 0) {
      correctness = "partially-correct"
    } else {
      correctness = "incorrect"
    }

    itemIdToGradingInfo[item.id] = {
      correctness,
      feedbackMessage: pickBestFeedbackForGrading(
        item.feedbackMessages ?? [],
        correctness,
      ),
      nthWasCorrect,
    }
  }

  const feedbackJson: GradingTyping = {
    version: 1,
    exerciseType: "typing",
    itemIdToGradingInfo,
  }

  return {
    grading_progress: "FullyGraded",
    score_given: numCorrect / (numCorrect + numIncorrect),
    score_maximum: 1,
    feedback_text: null,
    feedback_json: feedbackJson,
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
