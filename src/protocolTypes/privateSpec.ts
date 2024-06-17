export type ExerciseType = 'dragging'

export type PrivateSpec = PrivateSpecNoExerciseTypeSelected | PrivateSpecDragging | PrivateSpecTyping 

interface PrivateSpecNoExerciseTypeSelected {
  version: 1
  exerciseType: null
}

interface PrivateSpecDragging {
  version: 1
  exerciseType: 'dragging'
}

interface PrivateSpecTyping {
  version: 1
  exerciseType: 'typing'
}


export function createEmptyPrivateSpec(): PrivateSpec {
  return {
    version: 1,
    exerciseType: null,
  }
}
