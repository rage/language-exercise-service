import { css } from "@emotion/css"
import { SubmissionProps } from "."
import { useTranslation } from "react-i18next"
import CorrectnessMarker from "@/components/CorrectnessMarker"

const Dragging: React.FC<SubmissionProps> = ({
  publicSpec,
  userAnswer,
  modelSolutionSpec,
  gradingFeedback,
}) => {
  const { t } = useTranslation()
  if (
    publicSpec.exerciseType !== "dragging" ||
    userAnswer.exerciseType !== "dragging" ||
    (modelSolutionSpec && modelSolutionSpec.exerciseType !== "dragging") ||
    (gradingFeedback && gradingFeedback.exerciseType !== "dragging")
  ) {
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
          const itemAnswer = userAnswer.itemAnswers.find(
            (ia) => ia.itemId === item.id,
          )
          const modelSolutionOptionsBySlot =
            modelSolutionSpec?.itemIdTooptionsBySlot[item.id]
          const gradingGradingInfo =
            gradingFeedback?.itemIdToGradingInfo[item.id]
          let nthSlot = -1
          return (
            <div
              key={item.id}
              className={css`
                display: flex;
                gap: 0.3rem;
                align-items: center;
                margin-bottom: 1rem;

                &:last-of-type {
                  margin-bottom: 0;
                }
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
                  nthSlot += 1
                  const selectedOption = publicSpec.allOptions.find(
                    (o) =>
                      itemAnswer &&
                      o.id === itemAnswer.selectedOptions[nthSlot]?.id,
                  )

                  if (!selectedOption) {
                    return (
                      <span key={`slot-${n}-${nthSlot}`}>
                        &nbsp;{t("no-answer-selected")}&nbsp;
                      </span>
                    )
                  }

                  let selectedOptionWasCorrect = false
                  if (modelSolutionOptionsBySlot) {
                    selectedOptionWasCorrect =
                      modelSolutionOptionsBySlot[nthSlot].id ===
                        selectedOption.id ||
                      modelSolutionOptionsBySlot[nthSlot].text ===
                        selectedOption.text
                  } else {
                    selectedOptionWasCorrect =
                      gradingGradingInfo?.nthWasCorrect[nthSlot] === true
                  }

                  let highlightingStyles: {
                    backgroundColor: string
                    textColor: string
                    borderColor: string | undefined
                  }

                  if (selectedOptionWasCorrect) {
                    highlightingStyles = {
                      backgroundColor: "#EAF5F0",
                      textColor: "#3D7150",
                      borderColor: "#bedecd",
                    }
                  } else {
                    highlightingStyles = {
                      backgroundColor: "#fbeef0",
                      textColor: "#D4212A",
                      borderColor: "#f3c7ca",
                    }
                  }

                  const correctOptionWhenChosenIncorrectly =
                    (!selectedOptionWasCorrect &&
                      modelSolutionOptionsBySlot &&
                      modelSolutionOptionsBySlot[nthSlot]) ||
                    undefined

                  return (
                    <span>
                      &nbsp;
                      <span
                        className={css`
                          padding: 0.1rem;
                          border-radius: 6px;
                          ${highlightingStyles &&
                          `
                      padding: 0.3rem 0.2rem;
                      background-color: ${highlightingStyles.backgroundColor};
                      color: ${highlightingStyles.textColor};
                      ${highlightingStyles.borderColor && `border: 2px solid ${highlightingStyles.borderColor};`}
                      `}
                        `}
                        key={`slot-${selectedOption.id}`}
                      >
                        <CorrectnessMarker
                          isCorrect={selectedOptionWasCorrect}
                        />
                        {selectedOption.text}
                      </span>
                      &nbsp;
                      {correctOptionWhenChosenIncorrectly && (
                        <>
                          <span
                            className={css`
                              border-radius: 6px;
                              padding: 0.3rem 0.2rem;
                              background-color: #EAF5F0;
                              color: #3D7150;
                              border: 2px solid #EAF5F0;
                            `}
                          >
                            {correctOptionWhenChosenIncorrectly.text}
                          </span>
                          &nbsp;
                        </>
                      )}
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

export default Dragging