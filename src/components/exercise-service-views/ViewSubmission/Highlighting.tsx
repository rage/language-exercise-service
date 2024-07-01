import { SubmissionProps } from "."
import { css } from "@emotion/css"

const Highlighting: React.FC<SubmissionProps> = ({ publicSpec }) => {
  if (publicSpec.exerciseType !== "highlighting") {
    return null
  }

  return (
    <div
      className={css`
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
                const isSelected = false
                return (
                  <span
                    className={css`
                      padding: 0.1rem;
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
