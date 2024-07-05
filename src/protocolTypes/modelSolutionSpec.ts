import { FeedbackMessage } from "./privateSpec"
import { PublicSpecOption } from "./publicSpec"

export type ModelSolutionSpec =
  | ModelSolutionSpecDragging
  | ModelSolutionSpecTyping
  | ModelSolutionSpecHighlighting

export interface ModelSolutionSpecDragging {
  version: 1
  exerciseType: "dragging"
  /** Maps from slot it to a list of correct answers that is an array that is in the same order as the slots in the public spec. */
  itemIdTooptionsBySlot: Record<string, PublicSpecOption[]>
  itemIdToFeedbackMessages?: Record<string, FeedbackMessage[]>
  feedbackMessages?: FeedbackMessage[]
}

export interface ModelSolutionSpecTyping {
  version: 1
  exerciseType: "typing"
  items: ModelSolutionSpecItem[]
  feedbackMessages?: FeedbackMessage[]
}

export type Highligtable = { type: "highlightable"; text: string; id: string }

export type HighlightablePart =
  | Highligtable
  | { type: "non-highlightable"; text: string }

export interface ModelSolutionSpecHighlighting {
  version: 1
  exerciseType: "highlighting"
  correctHighlightables: PublicSpecOption[]
  feedbackMessages?: FeedbackMessage[]
}

export interface ModelSolutionSpecItem {
  id: string
  /** Each entry in the array contains the correct solutions for a slot, in order. Each slot may have multiple accepted solutions, denoted by the `|` character in the editing view. */
  optionsBySlot: { acceptedStrings: string[] }[]
  feedbackMessages?: FeedbackMessage[]
}
