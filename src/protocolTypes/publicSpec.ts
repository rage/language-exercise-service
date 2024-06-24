export type PublicSpec =
  | PublicSpecDragging
  | PublicSpecTyping
  | PublicSpecHighlighting

interface PublicSpecDragging {
  version: 1
  exerciseType: "dragging"
  items: PublicSpecItem[]
  /** Contains both correct and fake options in random order. */
  allOptions: string[]
}

interface PublicSpecTyping {
  version: 1
  exerciseType: "typing"
  items: PublicSpecItem[]
  /** Contains both correct and fake options in random order. */
  allOptions: string[]
}

interface PublicSpecHighlighting {
  version: 1
  exerciseType: "highlighting"
  text: string
}

interface PublicSpecItem {
  id: string
  text: TextPart[]
}

export type TextPart = { type: "text"; text: string } | { type: "slot" }
