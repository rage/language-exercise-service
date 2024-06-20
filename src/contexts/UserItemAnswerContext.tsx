import { UserAnswer } from "../protocolTypes/answer";

import { createExerciseServiceContext } from "@/shared-module/common/contexts/ExerciseServiceContext";

const UserItemAnswerContext = createExerciseServiceContext<UserAnswer>(
  () => false,
);

export default UserItemAnswerContext;
