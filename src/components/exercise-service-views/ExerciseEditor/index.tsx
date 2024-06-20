import React, { useState } from "react"

import { ExerciseType, PrivateSpec } from "../../../protocolTypes/privateSpec"
import ExerciseServiceContext from "../../../contexts/ExerciseServiceContext"
import SelectExerciseType from "./SelectExerciseType"
import DraggingEditor from "./EditorByExerciseType/Dragging"

export interface EditorProps {
  port: MessagePort
  privateSpec: PrivateSpec
}

const exerciseTypeToComponentMap: Record<ExerciseType, React.FC> = {
  dragging: DraggingEditor,
  typing: () => <div>TODO</div>,
  highlighting: () => <div>TODO</div>,
}

const EditorImpl: React.FC<React.PropsWithChildren<EditorProps>> = ({
  port,
  privateSpec,
}) => {
  const [outputState, setOutputState] = useState<PrivateSpec | null>(
    privateSpec,
  )

  const Editor = outputState?.exerciseType
    ? exerciseTypeToComponentMap[outputState.exerciseType]
    : null

  return (
    <ExerciseServiceContext.Provider
      value={{
        outputState,
        port: port,
        _rawSetOutputState: setOutputState,
        validate: (state) => {
          if (!state || !state.exerciseType) {
            return false
          }
          return true
        },
      }}
    >
      {!outputState?.exerciseType && <SelectExerciseType />}
      {Editor && <Editor />}
    </ExerciseServiceContext.Provider>
  )
}

export default EditorImpl
