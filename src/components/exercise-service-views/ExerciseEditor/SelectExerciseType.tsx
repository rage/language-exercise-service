import useExerciseServiceOutputState from "@/hooks/useExerciseServiceOutputState"
import { ExerciseType, PrivateSpec } from "@/protocolTypes/privateSpec"
import { css } from "@emotion/css"
import { useCallback } from "react"

const SelectExerciseType: React.FC = () => {
  const { selected: _selected, updateState } = useExerciseServiceOutputState(
    (arg) => arg,
  )

  const handleExerciseTypeChange = useCallback(
    (exerciseType: ExerciseType) => {
      updateState((draft) => {
        if (!draft) {
          return draft
        }
        if (exerciseType === "dragging") {
          return {
            version: 1,
            exerciseType: "dragging",
            items: [],
            options: [],
            fakeOptions: [],
            text: "",
          } satisfies PrivateSpec
        }
        if (exerciseType === "highlighting") {
          return {
            version: 1,
            exerciseType: "highlighting",
            text: "",
            correctHighlightedWords: [],
          } satisfies PrivateSpec
        }
        if (exerciseType === "typing") {
          return {
            version: 1,
            exerciseType: "typing",
            items: [],
            options: [],
            fakeOptions: [],
          } satisfies PrivateSpec
        }
        throw new Error("Invalid exercise type")
      })
    },
    [updateState],
  )

  return (
    <div
      className={css`
        margin: 1rem;
      `}
    >
      <h1>Select exercise type</h1>
      <button onClick={() => handleExerciseTypeChange("dragging")}>
        Dragging
      </button>
      <button onClick={() => handleExerciseTypeChange("highlighting")}>
        Highlighting
      </button>
      <button onClick={() => handleExerciseTypeChange("typing")}>Typing</button>
    </div>
  )
}

export default SelectExerciseType
