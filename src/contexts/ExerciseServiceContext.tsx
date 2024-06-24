import { PrivateSpec } from "../protocolTypes/privateSpec"

import { createExerciseServiceContext } from "@/shared-module/common/contexts/ExerciseServiceContext"

const ExerciseServiceContext = createExerciseServiceContext<PrivateSpec>(
  () => false,
)

export default ExerciseServiceContext
