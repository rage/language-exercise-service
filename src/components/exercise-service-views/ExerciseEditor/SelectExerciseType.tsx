import useExerciseServiceOutputState from "@/hooks/useExerciseServiceOutputState"
import { ExerciseType, PrivateSpec } from "@/protocolTypes/privateSpec"
import { generateRandomKey, uint8ArrayToHex } from "@/util/hashing"
import { css } from "@emotion/css"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

const SelectExerciseType: React.FC = () => {
  const { updateState } = useExerciseServiceOutputState((arg) => arg)

  const { t } = useTranslation()

  const handleExerciseTypeChange = useCallback(
    (exerciseType: ExerciseType) => {
      updateState((draft) => {
        if (!draft) {
          return draft
        }
        if (exerciseType === "dragging") {
          return {
            version: 1,
            exerciseType: "dragging",
            items: [],
            fakeOptions: [],
            secretKey: uint8ArrayToHex(generateRandomKey(32)),
            feedbackMessages: [],
          } satisfies PrivateSpec
        }
        if (exerciseType === "highlighting") {
          return {
            version: 1,
            exerciseType: "highlighting",
            text: "",
            feedbackMessages: [],
            secretKey: uint8ArrayToHex(generateRandomKey(32)),
          } satisfies PrivateSpec
        }
        if (exerciseType === "typing") {
          return {
            version: 1,
            exerciseType: "typing",
            items: [],
            matchingIsCaseInsensitive: false,
            feedbackMessages: [],
          } satisfies PrivateSpec
        }
        throw new Error("Invalid exercise type")
      })
    },
    [updateState],
  )

  return (
    <div
      className={css`
        margin: 1rem;
      `}
    >
      <h1>{t("select-exercise-type")}</h1>
      <button onClick={() => handleExerciseTypeChange("dragging")}>
        {t("dragging")}
      </button>
      <button onClick={() => handleExerciseTypeChange("highlighting")}>
        {t("highlighting")}
      </button>
      <button onClick={() => handleExerciseTypeChange("typing")}>
        {t("typing")}
      </button>
    </div>
  )
}

export default SelectExerciseType
