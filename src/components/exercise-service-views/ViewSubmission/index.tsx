import React from "react"
import { useTranslation } from "react-i18next"
import { UserAnswer } from "../../../protocolTypes/answer"
import { PublicSpec } from "../../../protocolTypes/publicSpec"
import { ModelSolutionSpec } from "../../../protocolTypes/modelSolutionSpec"
import { ItemAnswerFeedback } from "../../../protocolTypes/grading"
import { UserInformation } from "@/shared-module/common/exercise-service-protocol-types"

interface SubmissionProps {
  user_answer: UserAnswer
  publicAlternatives: PublicSpec
  modelSolutions: ModelSolutionSpec | null
  gradingFeedbackJson: ItemAnswerFeedback[] | null
  user_information: UserInformation
}

const Submission: React.FC<React.PropsWithChildren<SubmissionProps>> = (_props) => {
  const { t } = useTranslation()


  return null
}

export default Submission
