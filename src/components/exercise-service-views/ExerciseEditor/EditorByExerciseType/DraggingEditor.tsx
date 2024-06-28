import FeedbackMessageEditor from "@/components/FeedbackMessageEditor"
import useExerciseServiceOutputState from "@/hooks/useExerciseServiceOutputState"
import { css } from "@emotion/css"
import { useCallback } from "react"
import { v4 } from "uuid"

const DraggingEditor: React.FC = () => {
  const { selected: selected, updateState } = useExerciseServiceOutputState(
    (arg) => arg,
  )
  const addNewItem = useCallback(() => {
    updateState((draft) => {
      if (!draft || draft.exerciseType !== "dragging") {
        return draft
      }
      draft.items.push({
        id: v4(),
        text: "",
        feedbackMessages: [],
      })
    })
  }, [updateState])

  const remvoeItem = useCallback(
    (id: string) => {
      updateState((draft) => {
        if (!draft || draft.exerciseType !== "dragging") {
          return draft
        }
        draft.items = draft.items.filter((i) => i.id !== id)
      })
    },
    [updateState],
  )

  const removeFakeOption = useCallback(
    (index: number) => {
      updateState((draft) => {
        if (!draft || draft.exerciseType !== "dragging") {
          return draft
        }
        draft.fakeOptions = draft.fakeOptions.filter((_, i) => i !== index)
      })
    },
    [updateState],
  )

  const addFakeOption = useCallback(() => {
    updateState((draft) => {
      if (!draft || draft.exerciseType !== "dragging") {
        return draft
      }
      draft.fakeOptions.push("")
    })
  }, [updateState])

  if (!selected || selected.exerciseType !== "dragging") {
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
                  if (!draft || draft.exerciseType !== "dragging") {
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
            <button onClick={() => remvoeItem(item.id)}>Remove</button>
          </div>
          <FeedbackMessageEditor
            feedbackMessages={item.feedbackMessages}
            setFeedbackMessages={(e) => {
              updateState((draft) => {
                if (!draft || draft.exerciseType !== "dragging") {
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
      <button onClick={addNewItem}>Add item</button>
      <h2>Fake options</h2>
      <div>
        {selected.fakeOptions.map((fakeOption, n) => (
          <div
            className={css`
              display: flex;
              gap: 1rem;
              align-items: center;
              margin-bottom: 1rem;
            `}
            key={n}
          >
            <input
              type="text"
              className={css`
                width: 100%;
                resize: vertical;
              `}
              value={fakeOption}
              onChange={(e) => {
                updateState((draft) => {
                  if (!draft || draft.exerciseType !== "dragging") {
                    return draft
                  }
                  draft.fakeOptions[n] = e.target.value
                })
              }}
            />
            <button onClick={() => removeFakeOption(n)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={addFakeOption}>Add fake option</button>
    </div>
  )
}

export default DraggingEditor
