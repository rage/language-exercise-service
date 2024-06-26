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
      })
    })
  }, [updateState])

  if (!selected || selected.exerciseType !== "typing") {
    return null
  }
  return (
    <div>
      {selected.items.map((item) => (
        <>
          <div key={item.id}>
            <textarea
              className={css`
                width: 100%;
                margin-bottom: 1rem;
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
          </div>
        </>
      ))}
      <button onClick={addNewItem}>Add option</button>

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
