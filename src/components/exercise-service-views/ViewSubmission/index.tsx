import React from "react"
import { UserAnswer } from "../../../protocolTypes/answer"
import { PublicSpec } from "../../../protocolTypes/publicSpec"
import { ModelSolutionSpec } from "../../../protocolTypes/modelSolutionSpec"
import { Grading } from "../../../protocolTypes/grading"
import { UserInformation } from "@/shared-module/common/exercise-service-protocol-types"

interface SubmissionProps {
  user_answer: UserAnswer
  publicAlternatives: PublicSpec
  modelSolutions: ModelSolutionSpec | null
  gradingFeedbackJson: Grading | null
  user_information: UserInformation
}

const Submission: React.FC<React.PropsWithChildren<SubmissionProps>> = (_props) => {
  return null
}

export default Submission
