import React, { useState } from "react"

import { PrivateSpec } from "../../../protocolTypes/privateSpec"
import ExerciseServiceContext from "../../../contexts/ExerciseServiceContext"

export interface EditorProps {
  port: MessagePort
  privateSpec: PrivateSpec
}

const EditorImpl: React.FC<React.PropsWithChildren<EditorProps>> = ({ port, privateSpec }) => {
  const [outputState, setOutputState] = useState<PrivateSpec | null>(privateSpec)
  return (
    <ExerciseServiceContext.Provider
      value={{
        outputState,
        port: port,
        _rawSetOutputState: setOutputState,
        validate: () => true,
      }}
    >
      {null}
    </ExerciseServiceContext.Provider>
  )
}

export default EditorImpl
