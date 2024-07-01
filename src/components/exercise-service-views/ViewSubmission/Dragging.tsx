import { css } from "@emotion/css"
import { SubmissionProps } from "."

const Dragging: React.FC<SubmissionProps> = ({ publicSpec }) => {
  if (publicSpec.exerciseType !== "dragging") {
    return null
  }

  return (
    <div
      className={css`
        display: flex;
        flex-gap: 1rem;
      `}
    >
      <div
        className={css`
          flex-grow: 1;
        `}
      >
        {publicSpec.items.map((item, n) => {
          return (
            <div
              key={item.id}
              className={css`
                display: flex;
                gap: 0.3rem;
                align-items: center;
              `}
            >
              <div>{n + 1}. </div>
              <div>
                {item.textParts.map((textPart) => {
                  if (textPart.type === "text") {
                    return (
                      <span key={textPart.text}>{textPart.text.trim()}</span>
                    )
                  }
                  return <span key={`slot-${n}`}>{"slot"}</span>
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dragging
