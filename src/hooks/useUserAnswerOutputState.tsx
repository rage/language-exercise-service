import { UserAnswer } from "../protocolTypes/answer"
import UserItemAnswerContext from "../contexts/UserItemAnswerContext"

import useBaseExerciseServiceOutputState from "@/shared-module/common/hooks/exerciseServiceHooks/useExerciseServiceOutputState"

const useUserAnswerOutputState = <SelectorReturnType,>(
  selector: (arg: UserAnswer | null) => SelectorReturnType | null,
) => {
  return useBaseExerciseServiceOutputState(UserItemAnswerContext, selector)
}

export default useUserAnswerOutputState
