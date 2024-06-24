export type PrivateSpec =
  | PrivateSpecNoExerciseTypeSelected
  | PrivateSpecDragging
  | PrivateSpecTyping
  | PrivateSpecHighlighting

interface PrivateSpecNoExerciseTypeSelected {
  version: 1
  exerciseType: null
}

interface PrivateSpecDragging {
  version: 1
  exerciseType: "dragging"
  items: PrivateSpecItem[]
  fakeOptions: string[]
}

interface PrivateSpecTyping {
  version: 1
  exerciseType: "typing"
  items: PrivateSpecItem[]
  fakeOptions: string[]
}

interface PrivateSpecHighlighting {
  version: 1
  exerciseType: "highlighting"
  text: string
  correctHighlightedWords: HighlightedWord[]
}

export type ExerciseType = NonNullable<PrivateSpec["exerciseType"]>

interface PrivateSpecItem {
  id: string
  text: string
}

interface HighlightedWord {
  nThWordFromStart: number
}

export function createEmptyPrivateSpec(): PrivateSpec {
  return {
    version: 1,
    exerciseType: null,
  }
}
