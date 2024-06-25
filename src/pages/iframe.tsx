import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"

import { UserAnswer } from "../protocolTypes/answer"
import { ModelSolutionSpec } from "../protocolTypes/modelSolutionSpec"
import {
  createEmptyPrivateSpec,
  PrivateSpec,
} from "../protocolTypes/privateSpec"
import { PublicSpec } from "../protocolTypes/publicSpec"
import Renderer from "../components/exercise-service-views/Renderer"

import { StudentExerciseTaskSubmissionResult } from "@/shared-module/common/bindings"
import HeightTrackingContainer from "@/shared-module/common/components/HeightTrackingContainer"
import {
  forgivingIsSetStateMessage,
  UserInformation,
} from "@/shared-module/common/exercise-service-protocol-types"
import {
  isAnswerExerciseIframeState,
  isExerciseEditorIframeState,
  isSetLanguageMessage,
  isViewSubmissionIframeState,
} from "@/shared-module/common/exercise-service-protocol-types.guard"
import useExerciseServiceParentConnection from "@/shared-module/common/hooks/useExerciseServiceParentConnection"
import withErrorBoundary from "@/shared-module/common/utils/withErrorBoundary"
import { Grading } from "../protocolTypes/grading"
import { css } from "@emotion/css"
import { set } from "lodash"

export interface SubmissionData {
  submission_result: StudentExerciseTaskSubmissionResult
  user_answer: UserAnswer
  public_spec: unknown
}

export type State =
  | {
      viewType: "answer-exercise"
      publicSpec: PublicSpec
      userInformation: UserInformation
      previousSubmission: UserAnswer | null
    }
  | {
      viewType: "view-submission"
      publicSpec: PublicSpec
      modelSolutions: ModelSolutionSpec | null
      userAnswer: UserAnswer
      gradingFeedbackJson: Grading | null
      userInformation: UserInformation
    }
  | {
      viewType: "exercise-editor"
      privateSpec: PrivateSpec
      userInformation: UserInformation
    }

const IFrame: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useState<State | null>(null)

  const port = useExerciseServiceParentConnection((messageData) => {
    if (forgivingIsSetStateMessage(messageData)) {
      ReactDOM.flushSync(() => {
        if (messageData.view_type === "answer-exercise") {
          if (!isAnswerExerciseIframeState(messageData)) {
            throw new Error(
              "Set-state message data is invalid for the specified answer-exercise view type",
            )
          }
          const publicSpec = messageData.data.public_spec
          const quiz_answer = messageData.data.previous_submission

          setState({
            viewType: messageData.view_type,
            publicSpec: publicSpec as PublicSpec,
            userInformation: messageData.user_information,
            previousSubmission: quiz_answer as UserAnswer | null,
          })
        } else if (messageData.view_type === "exercise-editor") {
          if (!isExerciseEditorIframeState(messageData)) {
            throw new Error(
              "Set-state message data is invalid for the specified exercise-editor view type",
            )
          }
          const privateSpec = messageData.data.private_spec
          if (privateSpec === null) {
            setState({
              viewType: messageData.view_type,
              privateSpec: createEmptyPrivateSpec(),
              userInformation: messageData.user_information,
            })
            return
          } else {
            setState({
              viewType: messageData.view_type,
              privateSpec: privateSpec as PrivateSpec,
              userInformation: messageData.user_information,
            })
          }
        } else if (messageData.view_type === "view-submission") {
          if (!isViewSubmissionIframeState(messageData)) {
            throw new Error(
              "Set-state message data is invalid for the specified view-submission view type",
            )
          }
          const public_spec = messageData.data.public_spec
          const model_solution_spec = messageData.data.model_solution_spec
          const quiz_answer = messageData.data.user_answer

          setState({
            viewType: messageData.view_type,
            publicSpec: public_spec as PublicSpec,
            modelSolutions: model_solution_spec as ModelSolutionSpec | null,
            userAnswer: quiz_answer as UserAnswer,
            userInformation: messageData.user_information,
            gradingFeedbackJson: messageData.data.grading
              ?.feedback_json as Grading | null,
          })
        } else {
          // eslint-disable-next-line i18next/no-literal-string
          console.error("Unknown view type received from parent")
        }
      })
    } else if (isSetLanguageMessage(messageData)) {
      i18n.changeLanguage(messageData.data)
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      console.error("Frame received an unknown message from message port")
    }
  })

  return (
    <HeightTrackingContainer port={port}>
      <div
        className={css`
          padding: 1px;
        `}
      >
        <Renderer port={port} setState={setState} state={state} />
      </div>
    </HeightTrackingContainer>
  )
}

export default withErrorBoundary(IFrame)
