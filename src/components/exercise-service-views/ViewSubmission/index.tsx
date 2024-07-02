import React from "react"
import { UserAnswer } from "../../../protocolTypes/answer"
import { PublicSpec } from "../../../protocolTypes/publicSpec"
import { ModelSolutionSpec } from "../../../protocolTypes/modelSolutionSpec"
import { Grading } from "../../../protocolTypes/grading"
import { UserInformation } from "@/shared-module/common/exercise-service-protocol-types"

import dynamic from "next/dynamic"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const Component = exerciseTypeToComponent[props.publicSpec.exerciseType]
  return (
    <div>
      {Component ? (
        <Component {...props} />
      ) : (
        <div>{t("unsupported-exercise-type")}</div>
      )}
    </div>
  )
}

export default Submission
