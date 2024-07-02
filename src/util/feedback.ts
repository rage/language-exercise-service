import { GradingCorrectness } from "@/protocolTypes/grading"
import { FeedbackMessage } from "@/protocolTypes/privateSpec"

export function pickBestFeedbackForGrading(
  feedbacks: FeedbackMessage[],
  correctness: GradingCorrectness,
): FeedbackMessage | null {
  const specificMessageForCorrectness = feedbacks.find(
    (fm) => fm.correctness === correctness,
  )
  if (specificMessageForCorrectness) {
    return specificMessageForCorrectness
  }
  const anyMessage = feedbacks.find((fm) => fm.correctness === "any")
  if (anyMessage) {
    return anyMessage
  }
  return null
}
