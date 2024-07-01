import React from "react"
import { UserAnswer } from "../../../protocolTypes/answer"
import { PublicSpec } from "../../../protocolTypes/publicSpec"
import { ModelSolutionSpec } from "../../../protocolTypes/modelSolutionSpec"
import { Grading } from "../../../protocolTypes/grading"
import { UserInformation } from "@/shared-module/common/exercise-service-protocol-types"

import dynamic from "next/dynamic"

export interface SubmissionProps {
  userAnswer: UserAnswer
  publicSpec: PublicSpec
  modelSolutionSpec: ModelSolutionSpec | null
  gradingFeedback: Grading | null
  userInformation: UserInformation
}

const exerciseTypeToComponent = {
  dragging: dynamic(() => import("./Dragging")),
  typing: dynamic(() => import("./Typing")),
  highlighting: dynamic(() => import("./Highlighting")),
}

const Submission: React.FC<React.PropsWithChildren<SubmissionProps>> = (
  props,
) => {
  const Component = exerciseTypeToComponent[props.publicSpec.exerciseType]
  return (
    <div>
      {Component ? (
        <Component {...props} />
      ) : (
        <div>Unsupported exercise type</div>
      )}
    </div>
  )
}

export default Submission
