import React, { useCallback, useMemo, useState } from "react"

import {
  UserAnswer,
  createEmptyUserAnswer,
} from "../../../protocolTypes/answer"
import { PublicSpec } from "../../../protocolTypes/publicSpec"
import UserItemAnswerContext from "../../../contexts/UserItemAnswerContext"

import { UserInformation } from "@/shared-module/common/exercise-service-protocol-types"

export interface ExerciseProps {
  port: MessagePort
  publicSpec: PublicSpec
  previousSubmission: UserAnswer | null
  user_information: UserInformation
}

import dynamic from "next/dynamic"

const exerciseTypeToComponent = {
  dragging: dynamic(() => import("./Dragging")),
  typing: dynamic(() => import("./Typing")),
  highlighting: dynamic(() => import("./Highlighting")),
}

const Exercise: React.FC<React.PropsWithChildren<ExerciseProps>> = (props) => {
  const { port, publicSpec, previousSubmission } = props
  const intialAnswer = useMemo(() => {
    if (previousSubmission) {
      return previousSubmission
    }
    return createEmptyUserAnswer(publicSpec)
  }, [previousSubmission])
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(intialAnswer)

  const validate: (newState: UserAnswer | null) => boolean = useCallback(
    (_newState) => {
      return true
    },
    [],
  )

  const Component = exerciseTypeToComponent[publicSpec.exerciseType] ?? null

  return (
    <UserItemAnswerContext.Provider
      value={{
        outputState: userAnswer,
        port: port,
        _rawSetOutputState: setUserAnswer,
        validate,
      }}
    >
      {Component ? (
        <Component {...props} />
      ) : (
        <div>Unsupported exercise type</div>
      )}
    </UserItemAnswerContext.Provider>
  )
}

export default Exercise
