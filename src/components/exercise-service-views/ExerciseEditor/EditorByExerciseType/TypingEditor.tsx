import FeedbackMessageEditor from "@/components/FeedbackMessageEditor"
import useExerciseServiceOutputState from "@/hooks/useExerciseServiceOutputState"
import { css } from "@emotion/css"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"

const TypingEditor: React.FC = () => {
  const { t } = useTranslation()
  const { selected: selected, updateState } = useExerciseServiceOutputState(
    (arg) => arg,
  )
  const addNewItem = useCallback(() => {
    updateState((draft) => {
      if (!draft || draft.exerciseType !== "typing") {
        return draft
      }
      draft.items.push({
        id: v4(),
        text: "",
        feedbackMessages: [],
      })
    })
  }, [updateState])

  const removeItem = useCallback(
    (id: string) => {
      updateState((draft) => {
        if (!draft || draft.exerciseType !== "typing") {
          return draft
        }
        draft.items = draft.items.filter((i) => i.id !== id)
      })
    },
    [updateState],
  )

  if (!selected || selected.exerciseType !== "typing") {
    return null
  }
  return (
    <div>
      {selected.items.map((item, n) => (
        <div key={item.id}>
          <div
            className={css`
              display: flex;
              gap: 1rem;
              align-items: center;
              margin-bottom: 1rem;
            `}
          >
            <div>{n + 1}. </div>

            <textarea
              className={css`
                width: 100%;
                resize: vertical;
              `}
              value={item.text}
              onChange={(e) => {
                updateState((draft) => {
                  if (!draft || draft.exerciseType !== "typing") {
                    return draft
                  }
                  const draftItem = draft.items.find((i) => i.id === item.id)
                  if (!draftItem) {
                    return draft
                  }
                  draftItem.text = e.target.value
                })
              }}
            />
            <button onClick={() => removeItem(item.id)}>{t("remove")}</button>
          </div>
          <FeedbackMessageEditor
            forEverything={false}
            feedbackMessages={item.feedbackMessages}
            setFeedbackMessages={(e) => {
              updateState((draft) => {
                if (!draft || draft.exerciseType !== "typing") {
                  return draft
                }
                const draftItem = draft.items.find((i) => i.id === item.id)
                if (!draftItem) {
                  return draft
                }
                draftItem.feedbackMessages = e
              })
            }}
          />
        </div>
      ))}
      <button onClick={addNewItem}>{t("add-item")}</button>

      <div
        className={css`
          margin-top: 1rem;
        `}
      >
        <label>
          <input
            type="checkbox"
            checked={selected.matchingIsCaseInsensitive}
            onChange={(e) => {
              updateState((draft) => {
                if (!draft || draft.exerciseType !== "typing") {
                  return draft
                }
                draft.matchingIsCaseInsensitive = e.target.checked
              })
            }}
          />
          {t("matching-is-case-insensitive")}
        </label>
      </div>
      <FeedbackMessageEditor
        feedbackMessages={selected.feedbackMessages}
        forEverything
        setFeedbackMessages={(e) => {
          updateState((draft) => {
            if (!draft || draft.exerciseType !== "typing") {
              return draft
            }
            draft.feedbackMessages = e
          })
        }}
      />
    </div>
  )
}

export default TypingEditor
