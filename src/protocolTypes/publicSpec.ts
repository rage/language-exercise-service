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

export type Highligtable = { type: "highlightable"; text: string; id: string }

export type HighlightablePart =
  | Highligtable
  | { type: "non-highlightable"; text: string }

export interface PublicSpecHighlighting {
  version: 1
  exerciseType: "highlighting"
  highligtablePartsByParagraph: {
    paragraphNumber: number
    highlightableParts: HighlightablePart[]
  }[]
}

export interface PublicSpecItem {
  id: string
  textParts: TextPart[]
}

export interface PublicSpecOption {
  /** Semi-stable id, should stay the same as long as the item and the position of the option in the item does not change. Guranteed to not leak the correct item or the correct position, as this is created with hashing those values with privateSpec.secretKey */
  id: string
  text: string
}

export type TextPart = { type: "text"; text: string } | { type: "slot" }
