import { PublicSpec } from "./publicSpec"

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
  selectedOptions: (string | undefined)[]
}

export interface UserAnswerTyping {
  version: 1
  exerciseType: "typing"
}

export interface UserAnswerHighlighting {
  version: 1
  exerciseType: "highlighting"
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
      }
    default:
      throw new Error("Unsupported exercise type")
  }
}
