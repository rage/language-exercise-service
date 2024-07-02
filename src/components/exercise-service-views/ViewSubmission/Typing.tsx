import { css } from "@emotion/css"
import { SubmissionProps } from "."
import { useTranslation } from "react-i18next"
import CorrectnessMarker from "@/components/CorrectnessMarker"
import { FeedbackMessage } from "@/protocolTypes/privateSpec"
import { pickBestFeedbackForGrading } from "@/util/feedback"
import FeedbackMessageBox from "@/components/FeedbackMessageBox"

const Typing: React.FC<SubmissionProps> = ({
  publicSpec,
  userAnswer,
  modelSolutionSpec,
  gradingFeedback,
}) => {
  const { t } = useTranslation()
  if (
    publicSpec.exerciseType !== "typing" ||
    userAnswer.exerciseType !== "typing" ||
    (modelSolutionSpec && modelSolutionSpec.exerciseType !== "typing") ||
    (gradingFeedback && gradingFeedback.exerciseType !== "typing")
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
          const modelSolutionSpecItem = modelSolutionSpec?.items.find(
            (i) => i.id === item.id,
          )
          const gradingGradingInfo =
            gradingFeedback?.itemIdToGradingInfo[item.id]
          let feedbackMessage: FeedbackMessage | null = null
          if (
            modelSolutionSpecItem?.feedbackMessages &&
            gradingGradingInfo?.correctness
          ) {
            feedbackMessage = pickBestFeedbackForGrading(
              modelSolutionSpecItem.feedbackMessages,
              gradingGradingInfo.correctness,
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
                    nthSlot += 1

                    const answer = itemAnswer?.answers[nthSlot]

                    if (!answer) {
                      return (
                        <span key={`slot-${n}-${nthSlot}`}>
                          &nbsp;{t("no-answer-selected")}&nbsp;
                        </span>
                      )
                    }

                    let answerWasCorrect = false

                    const modelSolutionsBySlot =
                      modelSolutionSpecItem?.optionsBySlot[nthSlot]
                    if (modelSolutionsBySlot) {
                      answerWasCorrect =
                        modelSolutionsBySlot.acceptedStrings.includes(
                          answer.trim(),
                        )
                    } else {
                      answerWasCorrect =
                        gradingGradingInfo?.nthWasCorrect[nthSlot] === true
                    }

                    let highlightingStyles: {
                      backgroundColor: string
                      textColor: string
                      borderColor: string | undefined
                    }

                    if (answerWasCorrect) {
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

                    const correctSolutionWhenAnsweredIncorrectly =
                      !answerWasCorrect &&
                      modelSolutionsBySlot?.acceptedStrings[0]

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
                          key={`slot-${item.id}-${nthSlot}`}
                        >
                          <CorrectnessMarker isCorrect={answerWasCorrect} />
                          {answer.trim()}
                        </span>
                        &nbsp;
                        {correctSolutionWhenAnsweredIncorrectly && (
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
                              {correctSolutionWhenAnsweredIncorrectly.trim()}
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
    </div>
  )
}

export default Typing
