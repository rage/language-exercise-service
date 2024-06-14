import { PrivateSpec } from "../protocolTypes/privateSpec"

import { createExerciseServiceContext } from "@/shared-module/common/contexts/ExerciseServiceContext"

const QuizzesExerciseServiceContext = createExerciseServiceContext<PrivateSpec>(() => false)

export default QuizzesExerciseServiceContext
