export type PrivateSpec =
  | PrivateSpecNoExerciseTypeSelected
  | PrivateSpecDragging
  | PrivateSpecTyping
  | PrivateSpecHighlighting

export interface PrivateSpecNoExerciseTypeSelected {
  version: 1
  exerciseType: null
}

export interface PrivateSpecDragging {
  version: 1
  exerciseType: "dragging"
  items: PrivateSpecItem[]
  fakeOptions: string[]
  /** Random, unguessable string that may not be shared to the students. Used to hash PublicSpecOption id:s so that they don't leak the correct answer. */
  secretKey: string
}

export interface PrivateSpecTyping {
  version: 1
  exerciseType: "typing"
  items: PrivateSpecItem[]
  matchingIsCaseInsensitive: boolean
}

export interface PrivateSpecHighlighting {
  version: 1
  exerciseType: "highlighting"
  text: string
  /** Random, unguessable string that may not be shared to the students. Used to hash PublicSpecOption id:s so that they don't leak the correct answer. */
  secretKey: string
}

export type ExerciseType = NonNullable<PrivateSpec["exerciseType"]>

interface PrivateSpecItem {
  id: string
  text: string
}

export function createEmptyPrivateSpec(): PrivateSpec {
  return {
    version: 1,
    exerciseType: null,
  }
}
