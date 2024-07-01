import CorrectnessMarker from "@/components/CorrectnessMarker"
import { SubmissionProps } from "."
import { css } from "@emotion/css"

const Highlighting: React.FC<SubmissionProps> = ({
  publicSpec,
  userAnswer,
  modelSolutionSpec,
  gradingFeedback,
}) => {
  if (
    publicSpec.exerciseType !== "highlighting" ||
    userAnswer.exerciseType !== "highlighting" ||
    (modelSolutionSpec && modelSolutionSpec.exerciseType !== "highlighting") ||
    (gradingFeedback && gradingFeedback.exerciseType !== "highlighting")
  ) {
    return null
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
                const wasSelected = userAnswer.selectedWords.some(
                  (selectedWord) => selectedWord.id === part.id,
                )
                let selectedWordWasCorrect: boolean | undefined = undefined
                if (wasSelected) {
                  selectedWordWasCorrect =
                    modelSolutionSpec?.correctHighlightables.some(
                      (correctHighlightable) =>
                        correctHighlightable.id === part.id,
                    )
                  if (selectedWordWasCorrect === undefined && gradingFeedback) {
                    selectedWordWasCorrect =
                      gradingFeedback.gradingInfo.correctness === "correct"
                  }
                }
                let highlightingStyles:
                  | {
                      backgroundColor: string
                      textColor: string
                      borderColor: string
                    }
                  | undefined = undefined
                if (selectedWordWasCorrect !== undefined) {
                  highlightingStyles = {
                    backgroundColor: selectedWordWasCorrect
                      ? "#d4eadf"
                      : "fbeef0",
                    textColor: selectedWordWasCorrect ? "#68ae8a" : "#ed878c",
                    borderColor: selectedWordWasCorrect ? "#bedecd" : "#f3c7ca",
                  }
                }
                return (
                  <span
                    className={css`
                      padding: 0.1rem;
                      background-color: #f9f9f9;
                      border-radius: 6px;
                      ${highlightingStyles &&
                      `
                        background-color: ${highlightingStyles.backgroundColor};
                        color: ${highlightingStyles.textColor};
                        border: 2px solid ${highlightingStyles.borderColor};
                        `}
                    `}
                    key={part.id}
                  >
                    {wasSelected && <CorrectnessMarker isCorrect={selectedWordWasCorrect ?? false} />}
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
