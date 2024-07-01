import { SubmissionProps } from "."
import { css } from "@emotion/css"

const Typing: React.FC<SubmissionProps> = ({ publicSpec }) => {
  if (publicSpec.exerciseType !== "typing") {
    return null
  }

  return (
    <div
      className={css`
        display: flex;
        flex-gap: 1rem;
        margin-top: 1rem;
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
                margin-bottom: 1rem;
              `}
            >
              <div>{n + 1}. </div>
              <div>
                {item.textParts.map((textPart, tn) => {
                  if (textPart.type === "text") {
                    return (
                      <span key={textPart.text}>{textPart.text.trim()}</span>
                    )
                  }

                  return (
                    <span key={`slot-${n}-${tn}`}>
                      &nbsp;
                      <span>SLOT</span>
                      &nbsp;
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Typing
