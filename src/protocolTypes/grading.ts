import { FeedbackMessage } from "./privateSpec"

export type Grading = GradingDragging | GradingTyping | GradingHighlighting

export interface GradingDragging {
  version: 1
  exerciseType: "dragging"
  itemIdToGradingInfo: Record<string, GradingInfo>
}

export interface GradingTyping {
  version: 1
  exerciseType: "typing"
  itemIdToGradingInfo: Record<string, GradingInfo>
}

export interface GradingHighlighting {
  version: 1
  exerciseType: "highlighting"
  gradingInfo: GradingInfo
}

export interface GradingInfo {
  feedbackMessage: FeedbackMessage | null
  correctness: GradingCorrectness
}

export type GradingCorrectness = "correct" | "partially-correct" | "incorrect"
