import useUserAnswerOutputState from "@/hooks/useUserAnswerOutputState"
import { ExerciseProps } from "."
import { css } from "@emotion/css"
import { UserAnswerTyping } from "@/protocolTypes/answer"

const Typing: React.FC<ExerciseProps> = ({ publicSpec }) => {
  const { selected: answer, updateState: updateAnswer } =
    useUserAnswerOutputState<UserAnswerTyping>(
      (state) => state as UserAnswerTyping,
    )

  if (publicSpec.exerciseType !== "typing" || !answer) {
    return null
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    event.target.style.width = `${Math.max(20, value.length * 9)}px`
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
        {publicSpec.items.map((item) => {
          let placeHolderCounter = -1
          return (
            <div key={item.id}>
              {item.textParts.map((textPart, tn) => {
                if (textPart.type === "text") {
                  return <span key={textPart.text}>{textPart.text.trim()}</span>
                }
                placeHolderCounter += 1

                return (
                  <>
                    &nbsp;
                    <input
                      className={css`
                        width: 3rem;
                        min-width: 3rem;
                      `}
                      onChange={handleInputChange}
                      type="text"
                      key={textPart.type + tn}
                    />
                    &nbsp;
                  </>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Typing
