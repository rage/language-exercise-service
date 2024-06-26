import { Highligtable, PublicSpec, PublicSpecOption } from "./publicSpec"

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
  selectedWords: HighLightableAnswer[]
}

export type HighLightableAnswer = Omit<Highligtable, "type">

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
