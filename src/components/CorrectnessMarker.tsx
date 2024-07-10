import { css } from "@emotion/css"

import IncorrectIcon from "@/assets/incorrect.svg"
import CorrectIcon from "@/assets/correct.svg"
import { useTranslation } from "react-i18next"

const CorrectnessMarker = ({ isCorrect }: { isCorrect: boolean }) => {
  const { t } = useTranslation()

  return (
    <span
      className={css`
        margin-right: 0.15rem;
      `}
    >
      {isCorrect ? <CorrectIcon role="img" aria-label={t("correct-slot")} /> : <IncorrectIcon role="img" aria-label={t("incorrect-slot")} />}
    </span>
  )
}

export default CorrectnessMarker
