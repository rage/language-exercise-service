export type PrivateSpec = PrivateSpecNoExerciseTypeSelected | PrivateSpecDragging | PrivateSpecTyping | PrivateSpecHighlighting

interface PrivateSpecNoExerciseTypeSelected {
  version: 1
  exerciseType: null
}

interface PrivateSpecDragging {
  version: 1
  exerciseType: 'dragging'
  text: string
  items: PrivateSpecItem[]
  options: PrivateSpecOption[]
  fakeOptions: PrivateSpecOption[]
}

interface PrivateSpecTyping {
  version: 1
  exerciseType: 'typing'
  items: PrivateSpecItem[]
  options: PrivateSpecOption[]
  fakeOptions: PrivateSpecOption[]
}

interface PrivateSpecHighlighting {
  version: 1
  exerciseType: 'highlighting'
  text: string
  correctHighlightedWords: HighlightedWord[]
}

interface PrivateSpecItem {
  id: string
  text: string
  correctOptionId: string
}

interface PrivateSpecOption {
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
