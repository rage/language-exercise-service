import React, { useState } from "react"

import { PrivateSpec } from "../../../protocolTypes/privateSpec"
import QuizzesExerciseServiceContext from "../../../contexts/ExerciseServiceContext"

export interface EditorProps {
  port: MessagePort
  privateSpec: PrivateSpec
}

const EditorImpl: React.FC<React.PropsWithChildren<EditorProps>> = ({ port, privateSpec }) => {
  const [outputState, setOutputState] = useState<PrivateSpec | null>(privateSpec)
  return (
    <QuizzesExerciseServiceContext.Provider
      value={{
        outputState,
        port: port,
        _rawSetOutputState: setOutputState,
        validate: () => true,
      }}
    >
      {null}
    </QuizzesExerciseServiceContext.Provider>
  )
}

export default EditorImpl
