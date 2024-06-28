import useExerciseServiceOutputState from "@/hooks/useExerciseServiceOutputState"
import { css } from "@emotion/css"
import { useCallback } from "react"
import { v4 } from "uuid"

const TypingEditor: React.FC = () => {
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
        <>
          <div
            className={css`
              display: flex;
              gap: 1rem;
              align-items: center;
              margin-bottom: 1rem;
            `}
            key={item.id}
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
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        </>
      ))}
      <button onClick={addNewItem}>Add item</button>

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
          Matching is case insensitive
        </label>
      </div>
    </div>
  )
}

export default TypingEditor
