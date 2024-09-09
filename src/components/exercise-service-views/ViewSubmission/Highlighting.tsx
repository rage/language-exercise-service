import CorrectnessMarker from "@/components/CorrectnessMarker"
import { SubmissionProps } from "."
import { css } from "@emotion/css"
import { pickBestFeedbackForGrading } from "@/util/feedback"
import FeedbackMessageBox from "@/components/FeedbackMessageBox"
import { useTranslation } from "react-i18next"
import ScreenReaderOnly from "@/components/ScreenReaderOnly"

const Highlighting: React.FC<SubmissionProps> = ({
  publicSpec,
  userAnswer,
  modelSolutionSpec,
  gradingFeedback,
}) => {
  const { t } = useTranslation()
  if (
    publicSpec.exerciseType !== "highlighting" ||
    userAnswer.exerciseType !== "highlighting" ||
    (modelSolutionSpec && modelSolutionSpec.exerciseType !== "highlighting") ||
    (gradingFeedback && gradingFeedback.exerciseType !== "highlighting")
  ) {
    return null
  }

  let feedbackMessage = undefined
  if (
    modelSolutionSpec?.feedbackMessages &&
    gradingFeedback?.gradingInfo.correctness
  ) {
    feedbackMessage = pickBestFeedbackForGrading(
      modelSolutionSpec.feedbackMessages,
      gradingFeedback?.gradingInfo.correctness,
    )
  }
  if (!feedbackMessage) {
    feedbackMessage = gradingFeedback?.gradingInfo.feedbackMessage
  }

  return (
    <div
      className={css`
        p {
          margin-bottom: 1rem;

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      `}
    >
      {publicSpec.highligtablePartsByParagraph.map((paragraph) => {
        return (
          <p key={paragraph.paragraphNumber}>
            {paragraph.highlightableParts.map((part, j) => {
              if (part.type === "highlightable") {
                const modelSolutionSpecTellsThisIsCorrect =
                  modelSolutionSpec?.correctHighlightables.some(
                    (correctHighlightable) =>
                      correctHighlightable.id === part.id,
                  )
                const wasSelected = userAnswer.selectedWords.some(
                  (selectedWord) => selectedWord.id === part.id,
                )
                let selectedWordWasCorrect: boolean | undefined = undefined
                if (wasSelected) {
                  const selectedIndex = userAnswer.selectedWords.findIndex(
                    (selectedWord) => selectedWord.id === part.id,
                  )
                  selectedWordWasCorrect =
                    modelSolutionSpec?.correctHighlightables.some(
                      (correctHighlightable) =>
                        correctHighlightable.id === part.id,
                    )
                  if (selectedWordWasCorrect === undefined && gradingFeedback) {
                    selectedWordWasCorrect =
                      gradingFeedback.gradingInfo.nthWasCorrect[selectedIndex]
                  }
                }
                let highlightingStyles:
                  | {
                      backgroundColor: string
                      textColor: string
                      borderColor: string | undefined
                    }
                  | undefined = undefined
                if (selectedWordWasCorrect !== undefined) {
                  highlightingStyles = {
                    backgroundColor: selectedWordWasCorrect
                      ? "#EAF5F0"
                      : "#fbeef0",
                    textColor: selectedWordWasCorrect ? "#3D7150" : "#D4212A",
                    borderColor: selectedWordWasCorrect ? "#bedecd" : "#f3c7ca",
                  }
                }
                const shouldHaveSelectedButDidnt =
                  !wasSelected && modelSolutionSpecTellsThisIsCorrect
                if (shouldHaveSelectedButDidnt) {
                  highlightingStyles = {
                    backgroundColor: "#EAF5F0",
                    textColor: "#3D7150",
                    borderColor: undefined,
                  }
                }
                return (
                  <span
                    className={css`
                      padding: 0.1rem;
                      border-radius: 6px;
                      ${highlightingStyles &&
                      `
                        padding: 0.3rem 0.2rem;
                        white-space: nowrap;
                        background-color: ${highlightingStyles.backgroundColor};
                        color: ${highlightingStyles.textColor};
                        ${highlightingStyles.borderColor && `border: 2px solid ${highlightingStyles.borderColor};`}
                        `}
                    `}
                    key={part.id}
                  >
                    {wasSelected && (
                      <CorrectnessMarker
                        isCorrect={selectedWordWasCorrect ?? false}
                      />
                    )}
                    {shouldHaveSelectedButDidnt && (
                      <ScreenReaderOnly>
                        {t("unselected-word-that-would-ve-been-correct")}
                      </ScreenReaderOnly>
                    )}
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
      {feedbackMessage && <FeedbackMessageBox message={feedbackMessage} />}
    </div>
  )
}

export default Highlighting
