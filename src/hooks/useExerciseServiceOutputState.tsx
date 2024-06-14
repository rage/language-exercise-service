import { PrivateSpec } from "../protocolTypes/privateSpec"
import QuizzesExerciseServiceContext from "../contexts/ExerciseServiceContext"

import useExerciseServiceOutputState from "@/shared-module/common/hooks/exerciseServiceHooks/useExerciseServiceOutputState"

const PRIVATE_SPEC = "private_spec"

const useQuizzesExerciseServiceOutputState = <SelectorReturnType,>(
  selector: (arg: PrivateSpec | null) => SelectorReturnType | null,
) => {
  return useExerciseServiceOutputState(QuizzesExerciseServiceContext, selector, PRIVATE_SPEC)
}

export default useQuizzesExerciseServiceOutputState
