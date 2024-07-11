import useUserAnswerOutputState from "@/hooks/useUserAnswerOutputState"
import { ExerciseProps } from "."
import {
  HighLightableAnswer,
  UserAnswerHighlighting,
} from "@/protocolTypes/answer"
import { css } from "@emotion/css"
import { useCallback } from "react"
import { Highligtable } from "@/protocolTypes/publicSpec"

const Highlighting: React.FC<ExerciseProps> = ({ publicSpec }) => {
  const { selected: answer, updateState: updateAnswer } =
    useUserAnswerOutputState<UserAnswerHighlighting>(
      (state) => state as UserAnswerHighlighting,
    )

  const onClick = useCallback(
    (clicked: Highligtable) => {
      updateAnswer((current) => {
        if (!current) {
          throw new Error("Answer state is not initialized")
        }
        const partAlreadySelected = current?.selectedWords.findIndex(
          (part) => part.id === clicked.id,
        )
        if (partAlreadySelected === -1) {
          current.selectedWords.push({
            id: clicked.id,
            text: clicked.text,
          } satisfies HighLightableAnswer)
        } else {
          current.selectedWords.splice(partAlreadySelected, 1)
        }
      })
    },
    [updateAnswer],
  )

  if (publicSpec.exerciseType !== "highlighting" || !answer) {
    return null
  }

  return (
    <div
      className={css`
        padding: 3px;
        p {
          margin-bottom: 1rem;
          user-select: none;
        }
      `}
    >
      {publicSpec.highligtablePartsByParagraph.map((paragraph) => {
        return (
          <p key={paragraph.paragraphNumber}>
            {paragraph.highlightableParts.map((part, j) => {
              if (part.type === "highlightable") {
                const isSelected = answer.selectedWords.some(
                  (selected) => selected.id === part.id,
                )
                return (
                  <span
                    role="button"
                    aria-pressed={isSelected}
                    tabIndex={0}
                    className={css`
                      padding: 0 0.1rem;
                      cursor: pointer;
                      background-color: #f9f9f9;
                      ${isSelected && `background-color: #ecd9ff;`}
                      filter: brightness(1) contrast(1);
                      transition: filter 0.2s;
                      &:hover {
                        filter: brightness(0.9) contrast(1.1);
                      }
                    `}
                    key={part.id}
                    onClick={() => onClick(part)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onClick(part)
                      }
                    }}
                  >
                    {part.text}
                  </span>
                )
              } else {
                return <span key={`non-highlightable-${j}`}>{part.text}</span>
              }
            })}
          </p>
        )
      })}
    </div>
  )
}

export default Highlighting
