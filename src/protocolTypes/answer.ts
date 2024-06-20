export interface UserAnswer {
  version: 1
}

export function createEmptyUserAnswer(): UserAnswer {
  return {
    version: 1,
  }
}
