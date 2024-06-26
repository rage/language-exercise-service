import useUserAnswerOutputState from "@/hooks/useUserAnswerOutputState"
import { ExerciseProps } from "."
import { UserAnswerHighlighting } from "@/protocolTypes/answer"
import { useMemo } from "react"
import { css } from "@emotion/css"

const Highlighting: React.FC<ExerciseProps> = ({ publicSpec }) => {
  const { selected: answer, updateState: updateAnswer } =
    useUserAnswerOutputState<UserAnswerHighlighting>(
      (state) => state as UserAnswerHighlighting,
    )

  if (publicSpec.exerciseType !== "highlighting" || !answer) {
    return null
  }

  const textSplitToParagraps = useMemo(
    () => publicSpec.text.split("\n\n"),
    [publicSpec.text],
  )

  return (
    <div
      className={css`
        p {
          margin-bottom: 1rem;
          user-select: none;
        }
      `}
    >
      {textSplitToParagraps.map((paragraph, nthParagraph) => {
        const parts = paragraphToHighlightableParts(paragraph)
        return (
          <p key={nthParagraph}>
            {parts.map((part, j) => {
              if (part.type === "highlightable") {
                return (
                  <span
                    className={css`
                      padding: 0.1rem;
                      cursor: pointer;
                      background-color: #f9f9f9;
                      filter: brightness(1) contrast(1);
                      transition: filter 0.2s;
                      &:hover {
                        filter: brightness(0.9) contrast(1.1);
                      }
                    `}
                    key={j}
                  >
                    {part.text}
                  </span>
                )
              } else {
                return <span key={j}>{part.text}</span>
              }
            })}
          </p>
        )
      })}
    </div>
  )
}

type HighlightablePart =
  | { type: "highlightable"; text: string }
  | { type: "non-highlightable"; text: string }

/** Only words should be hightlightable */
function paragraphToHighlightableParts(paragraph: string): HighlightablePart[] {
  const nonHighlightable = [
    " ", "\n", "\t", "\r", ".", ",", ":", ";", "!", "?", 
    '"', "'", "“", "”", "‘", "’", "(", ")", "[", "]", "{", "}", 
    "/", "\\", "*", "+", "=", "&", "%", "$", "#", "@", "^", "|", "~", "<", ">"
  ];
  const parts: HighlightablePart[] = [];
  let currentText = '';
  let currentType: 'highlightable' | 'non-highlightable' | null = null;

  const addPart = () => {
    if (currentText !== '' && currentType) {
      parts.push({ type: currentType, text: currentText });
      currentText = '';
    }
  };

  for (let i = 0; i < paragraph.length; i++) {
    const char = paragraph[i];
    if (currentType === 'highlightable' || currentType === null) {
      if (nonHighlightable.includes(char)) {
        addPart();
        currentType = 'non-highlightable';
      } else {
        currentType = 'highlightable';
      }
    } else if (currentType === 'non-highlightable') {
      if (nonHighlightable.includes(char)) {
        currentType = 'non-highlightable';
      } else {
        addPart();
        currentType = 'highlightable';
      }
    }
    currentText += char;
  }

  // Add any remaining text as a part
  addPart();

  return parts;
}

export default Highlighting
