import { css } from "@emotion/css"

import IncorrectIcon from "@/assets/incorrect.svg"
import CorrectIcon from "@/assets/correct.svg"

const CorrectnessMarker = ({ isCorrect }: { isCorrect: boolean }) => {
  return (
    <span
      className={css`
        margin-right: 0.15rem;
      `}
    >
      {isCorrect ? <CorrectIcon /> : <IncorrectIcon />}
    </span>
  )
}

export default CorrectnessMarker
