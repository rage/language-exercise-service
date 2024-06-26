import { PublicSpecOption } from "./publicSpec"

export type ModelSolutionSpec =
  | ModelSolutionSpecDragging
  | ModelSolutionSpecTyping
  | ModelSolutionSpecHighlighting

export interface ModelSolutionSpecDragging {
  version: 1
  exerciseType: "dragging"
  /** Maps from slot it to a list of correct answers that is an array that is in the same order as the slots in the public spec. */
  itemIdToCorrectOptions: Record<string, PublicSpecOption[]>
}

export interface ModelSolutionSpecTyping {
  version: 1
  exerciseType: "typing"
  items: ModelSolutionSpecItem[]
}

export type Highligtable = { type: "highlightable"; text: string; id: string }

export type HighlightablePart =
  | Highligtable
  | { type: "non-highlightable"; text: string }

export interface ModelSolutionSpecHighlighting {
  version: 1
  exerciseType: "highlighting"
  highlightableIdToCorrectOption: Record<string, PublicSpecOption>
}

export interface ModelSolutionSpecItem {
  id: string
  correctOption: PublicSpecOption[]
}
