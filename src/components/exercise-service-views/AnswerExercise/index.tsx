import React, { useCallback, useMemo, useState } from "react";

import {
  UserAnswer,
  createEmptyUserAnswer,
} from "../../../protocolTypes/answer";
import { PublicSpec } from "../../../protocolTypes/publicSpec";
import UserItemAnswerContext from "../../../contexts/UserItemAnswerContext";

import { UserInformation } from "@/shared-module/common/exercise-service-protocol-types";

export interface ExerciseProps {
  port: MessagePort;
  publicSpec: PublicSpec;
  previousSubmission: UserAnswer | null;
  user_information: UserInformation;
}

const Exercise: React.FC<React.PropsWithChildren<ExerciseProps>> = ({
  port,
  previousSubmission,
}) => {
  const intialAnswer = useMemo(() => {
    if (previousSubmission) {
      return previousSubmission;
    }
    return createEmptyUserAnswer();
  }, [previousSubmission]);
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(intialAnswer);

  const validate: (newState: UserAnswer | null) => boolean = useCallback(
    (_newState) => {
      return true;
    },
    [],
  );

  return (
    <UserItemAnswerContext.Provider
      value={{
        outputState: userAnswer,
        port: port,
        _rawSetOutputState: setUserAnswer,
        validate,
      }}
    >
      {null}
    </UserItemAnswerContext.Provider>
  );
};

export default Exercise;
