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
    (newState) => {
      if (!newState) {
        return false
      }
      if (publicSpec.exerciseType === "dragging") {
        for (const item of publicSpec.items) {
          if (newState.exerciseType !== "dragging") {
            return false
          }
          const answer = newState.itemAnswers.find(
            (ia) => ia.itemId === item.id,
          )
          if (!answer) {
            return false
          }
          const numberOfSlots = item.textParts.filter(
            (o) => o.type === "slot",
          ).length
          if (answer.selectedOptions.length !== numberOfSlots) {
            return false
          }
          if (answer.selectedOptions.some((o) => !o)) {
            return false
          }
        }
        return true
      }
      return false
    },
    [publicSpec],
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
