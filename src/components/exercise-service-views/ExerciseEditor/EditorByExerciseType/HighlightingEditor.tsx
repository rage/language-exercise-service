import React, { useRef, useEffect, useCallback } from "react"
import useExerciseServiceOutputState from "@/hooks/useExerciseServiceOutputState"
import { css } from "@emotion/css"
import FeedbackMessageEditor from "@/components/FeedbackMessageEditor"

const HighlightingEditor: React.FC = () => {
  const { selected, updateState } = useExerciseServiceOutputState((arg) => arg)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [adjustHeight, selected])

  if (!selected || selected.exerciseType !== "highlighting") {
    return null
  }

  return (
    <div>
      <textarea
        ref={textareaRef}
        className={css`
          width: 100%;
          margin-bottom: 1rem;
          resize: none;
          overflow-y: hidden;
          min-height: 10rem;
        `}
        value={selected.text}
        onChange={(e) => {
          updateState((draft) => {
            if (!draft || draft.exerciseType !== "highlighting") {
              return draft
            }
            draft.text = e.target.value
          })
          adjustHeight()
        }}
      />
      <FeedbackMessageEditor
        forEverything
        feedbackMessages={selected.feedbackMessages}
        setFeedbackMessages={(e) => {
          updateState((draft) => {
            if (!draft || draft.exerciseType !== "highlighting") {
              return draft
            }
            draft.feedbackMessages = e
          })
        }}
      />
    </div>
  )
}

export default HighlightingEditor
