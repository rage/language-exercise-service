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
                const modelSolutionSpecTellsThisIsCorrect = modelSolutionSpec?.correctHighlightables.some(
                  (correctHighlightable) => correctHighlightable.id === part.id,
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
                if (!wasSelected && modelSolutionSpecTellsThisIsCorrect) {
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
                        background-color: ${highlightingStyles.backgroundColor};
                        color: ${highlightingStyles.textColor};
                        ${highlightingStyles.borderColor && `border: 2px solid ${highlightingStyles.borderColor};`}
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
