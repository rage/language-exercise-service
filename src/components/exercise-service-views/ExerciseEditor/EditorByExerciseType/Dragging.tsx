import useExerciseServiceOutputState from "@/hooks/useExerciseServiceOutputState";
import { css } from "@emotion/css";
import { useCallback } from "react";
import { v4 } from "uuid";

const DraggingEditor: React.FC = () => {
  const { selected: selected, updateState } = useExerciseServiceOutputState(
    (arg) => arg,
  );
  const addNewItem = useCallback(() => {
    updateState((draft) => {
      if (!draft || draft.exerciseType !== "dragging") {
        return draft;
      }
      draft.items.push({
        id: v4(),
        text: "",
      });
    });
  }, [updateState]);

  if (!selected || selected.exerciseType !== "dragging") {
    return null;
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
                  if (!draft || draft.exerciseType !== "dragging") {
                    return draft;
                  }
                  const draftItem = draft.items.find((i) => i.id === item.id);
                  if (!draftItem) {
                    return draft;
                  }
                  draftItem.text = e.target.value;
                });
              }}
            />
          </div>
        </>
      ))}
      <button onClick={addNewItem}>Add option</button>
    </div>
  );
};

export default DraggingEditor;
