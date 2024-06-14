import { UserAnswer } from "../protocolTypes/answer"
import UserItemAnswerContext from "../contexts/UserItemAnswerContext"

import useExerciseServiceOutputState from "@/shared-module/common/hooks/exerciseServiceHooks/useExerciseServiceOutputState"

const useQuizzesUserAnswerOutputState = <SelectorReturnType,>(
  selector: (arg: UserAnswer | null) => SelectorReturnType | null,
) => {
  return useExerciseServiceOutputState(UserItemAnswerContext, selector)
}

export default useQuizzesUserAnswerOutputState
