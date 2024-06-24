import { PrivateSpec } from "../protocolTypes/privateSpec"
import ExerciseServiceContext from "../contexts/ExerciseServiceContext"

import useBaseExerciseServiceOutputState from "@/shared-module/common/hooks/exerciseServiceHooks/useExerciseServiceOutputState"

const PRIVATE_SPEC = "private_spec"

const useExerciseServiceOutputState = <SelectorReturnType,>(
  selector: (arg: PrivateSpec | null) => SelectorReturnType | null,
) => {
  return useBaseExerciseServiceOutputState(
    ExerciseServiceContext,
    selector,
    PRIVATE_SPEC,
  )
}

export default useExerciseServiceOutputState
