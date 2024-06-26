export type PublicSpec =
  | PublicSpecDragging
  | PublicSpecTyping
  | PublicSpecHighlighting

export interface PublicSpecDragging {
  version: 1
  exerciseType: "dragging"
  items: PublicSpecItem[]
  /** Contains both correct and fake options in alphabetical order. */
  allOptions: PublicSpecOption[]
}

export interface PublicSpecTyping {
  version: 1
  exerciseType: "typing"
  items: PublicSpecItem[]
}

export interface PublicSpecHighlighting {
  version: 1
  exerciseType: "highlighting"
  text: string
}

export interface PublicSpecItem {
  id: string
  text: TextPart[]
}

export interface PublicSpecOption {
  /** Semi-stable id, should stay the same as long as the item and the position of the option in the item does not change. Guranteed to not leak the correct item or the correct position, as this is created with hashing those values with privateSpec.secretKey */
  id: string
  text: string
}

export type TextPart = { type: "text"; text: string } | { type: "slot" }
