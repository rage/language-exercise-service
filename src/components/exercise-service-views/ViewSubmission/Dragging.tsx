import { css } from "@emotion/css"
import { SubmissionProps } from "."
import { useTranslation } from "react-i18next"
import CorrectnessMarker from "@/components/CorrectnessMarker"
import { pickBestFeedbackForGrading } from "@/util/feedback"
import { FeedbackMessage } from "@/protocolTypes/privateSpec"
import FeedbackMessageBox from "@/components/FeedbackMessageBox"
import ScreenReaderOnly from "@/components/ScreenReaderOnly"

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

  let overallFeedbackMessage = gradingFeedback?.overallFeedbackMessage
  if (
    modelSolutionSpec?.feedbackMessages &&
    gradingFeedback?.overallCorrectness
  ) {
    overallFeedbackMessage = pickBestFeedbackForGrading(
      modelSolutionSpec.feedbackMessages,
      gradingFeedback.overallCorrectness,
    )
  }

  return (
    <div>
      <div>
        {publicSpec.items.map((item, n) => {
          const itemAnswer = userAnswer.itemAnswers.find(
            (ia) => ia.itemId === item.id,
          )
          const modelSolutionOptionsBySlot =
            modelSolutionSpec?.itemIdTooptionsBySlot[item.id]
          const gradingGradingInfo =
            gradingFeedback?.itemIdToGradingInfo[item.id]
          const modelSolutionFeedbackMessages =
            modelSolutionSpec?.itemIdToFeedbackMessages &&
            modelSolutionSpec?.itemIdToFeedbackMessages[item.id]

          let feedbackMessage: FeedbackMessage | null = null
          if (
            modelSolutionFeedbackMessages &&
            gradingGradingInfo?.correctness
          ) {
            feedbackMessage = pickBestFeedbackForGrading(
              modelSolutionFeedbackMessages,
              gradingGradingInfo?.correctness,
            )
          }
          if (!feedbackMessage) {
            feedbackMessage = gradingGradingInfo?.feedbackMessage ?? null
          }

          let nthSlot = -1
          return (
            <div
              className={css`
                margin-bottom: 1rem;

                &:last-of-type {
                  margin-bottom: 0;
                }
              `}
            >
              <div
                key={`item-${item.id}`}
                className={css`
                  display: flex;
                  gap: 0.3rem;
                  align-items: center;
                `}
              >
                <div>{n + 1}. </div>
                <div>
                  {item.textParts.map((textPart, n) => {
                    if (textPart.type === "text") {
                      return (
                        <span key={`${textPart.text}-${n}`}>
                          {textPart.text.trim()}
                        </span>
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
                              white-space: nowrap;
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
                                background-color: #eaf5f0;
                                color: #3d7150;
                                border: 2px solid #eaf5f0;
                              `}
                            >
                              <ScreenReaderOnly>
                                {t("correct-answer-was")}
                              </ScreenReaderOnly>
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
              {feedbackMessage && (
                <FeedbackMessageBox message={feedbackMessage} />
              )}
            </div>
          )
        })}
      </div>
      {overallFeedbackMessage && (
        <div
          className={css`
            margin-top: 1rem;
          `}
        >
          <FeedbackMessageBox message={overallFeedbackMessage} />
        </div>
      )}
    </div>
  )
}

export default Dragging
