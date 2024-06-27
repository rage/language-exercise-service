import useUserAnswerOutputState from "@/hooks/useUserAnswerOutputState"
import { ExerciseProps } from "."
import { css } from "@emotion/css"
import { UserAnswerTyping } from "@/protocolTypes/answer"
import { ChangeEvent } from "react"

const Typing: React.FC<ExerciseProps> = ({ publicSpec }) => {
  const { selected: answer, updateState: updateAnswer } =
    useUserAnswerOutputState<UserAnswerTyping>(
      (state) => state as UserAnswerTyping,
    )

  if (publicSpec.exerciseType !== "typing" || !answer) {
    return null
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, ItemId: string, nthSlot: number) => {
    const { value } = event.target

    event.target.style.width = `${Math.max(20, value.length * 9)}px`
    updateAnswer((prev) => {
      if (!prev) {
        throw new Error("Answer is not initialized")
      }
      let itemAnswers = prev.itemAnswers.find((ia) => ia.itemId === ItemId)
      if (!itemAnswers) {
        itemAnswers = { itemId: ItemId, answers: [] }
        prev.itemAnswers.push(itemAnswers)
      }
      itemAnswers.answers[nthSlot] = value
    })
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
                const nthSlot = placeHolderCounter

                return (
                  <>
                    &nbsp;
                    <input
                      className={css`
                        width: 3rem;
                        min-width: 3rem;
                      `}
                      onChange={(e) => handleInputChange(e, item.id, nthSlot)}
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
