import { PublicSpec, PublicSpecOption } from "./publicSpec"

export type UserAnswer =
  | UserAnswerDragging
  | UserAnswerTyping
  | UserAnswerHighlighting

export interface UserAnswerDragging {
  version: 1
  exerciseType: "dragging"
  itemAnswers: ItemAnswer[]
}

export interface ItemAnswer {
  itemId: string
  selectedOptions: (PublicSpecOption | null)[]
}

export interface UserAnswerTyping {
  version: 1
  exerciseType: "typing"
}

export interface UserAnswerHighlighting {
  version: 1
  exerciseType: "highlighting"
  selectedWords: SelectedWord[]
}

export interface SelectedWord {
  /** The text that was selected */
  text: string
  /** Tells which paragraph the word is in. */
  nThParagraph: number
  /** Tells which word the word is in the paragraph. */
  nThWord: number
}

export function createEmptyUserAnswer(publicSpec: PublicSpec): UserAnswer {
  switch (publicSpec.exerciseType) {
    case "dragging":
      return {
        version: 1,
        exerciseType: "dragging",
        itemAnswers: [],
      }
    case "typing":
      return {
        version: 1,
        exerciseType: "typing",
      }
    case "highlighting":
      return {
        version: 1,
        exerciseType: "highlighting",
        selectedWords: [],
      }
    default:
      throw new Error("Unsupported exercise type")
  }
}
