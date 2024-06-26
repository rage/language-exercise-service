import { HighlightablePart } from "@/protocolTypes/publicSpec"
import { oneWayStringToId } from "./hashing"

const NON_HIGHTLIGHTABLE_CHARACTERS = [
  " ",
  "\n",
  "\t",
  "\r",
  ".",
  ",",
  ":",
  ";",
  "!",
  "?",
  '"',
  "'",
  "“",
  "”",
  "‘",
  "’",
  "(",
  ")",
  "{",
  "}",
  "/",
  "\\",
  "*",
  "+",
  "=",
  "&",
  "%",
  "$",
  "#",
  "@",
  "^",
  "|",
  "~",
  "<",
  ">",
  // IMPORTANT: Do not add the "[" and "]" characters here, as the model solution spec generation relies on them being highlightable. They are not possible to be highlightable anyway because they are used to denote the start and end of a correct word.
]

/** Only words should be hightlightable */
export function paragraphToHighlightableParts(
  paragraph: string,
  paragraphNumber: number,
  secretKey: string,
): HighlightablePart[] {
  const parts: HighlightablePart[] = []
  let currentText = ""
  let currentType: "highlightable" | "non-highlightable" | null = null

  const numberOfTimesWordHasAppeared = new Map<string, number>()

  // We don't want the id to change if someone slightly edits the paragrap before this word
  // That's why we derive the id from the paragraph number, the word itself, and the number of times the word has appeared so far in the paragraph
  const deriveId = (text: string) => {
    const trimmedText = text.trim()
    const prevAppearedCount = numberOfTimesWordHasAppeared.get(trimmedText) || 0
    const apperedCount = prevAppearedCount + 1
    numberOfTimesWordHasAppeared.set(trimmedText, apperedCount)
    const hash = oneWayStringToId(
      `${paragraphNumber}-${trimmedText}-${apperedCount}`,
      // No need to namespace this one, so we use a NULL UUID
      "00000000-0000-0000-0000-000000000000",
      secretKey,
    )
    return hash
  }

  const addPart = () => {
    if (currentText !== "" && currentType) {
      if (currentType === "highlightable") {
        parts.push({
          type: currentType,
          text: currentText,
          id: deriveId(currentText),
        })
      } else {
        parts.push({ type: currentType, text: currentText })
      }
      currentText = ""
    }
  }

  for (let i = 0; i < paragraph.length; i++) {
    const char = paragraph[i]
    if (currentType === "highlightable" || currentType === null) {
      if (NON_HIGHTLIGHTABLE_CHARACTERS.includes(char)) {
        addPart()
        currentType = "non-highlightable"
      } else {
        currentType = "highlightable"
      }
    } else if (currentType === "non-highlightable") {
      if (NON_HIGHTLIGHTABLE_CHARACTERS.includes(char)) {
        currentType = "non-highlightable"
      } else {
        addPart()
        currentType = "highlightable"
      }
    }
    currentText += char
  }

  // Add any remaining text as a part
  addPart()

  return parts
}
