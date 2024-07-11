import { FeedbackMessage } from "@/protocolTypes/privateSpec"
import InfoIcon from "@/assets/info.svg"
import { css } from "@emotion/css"
import { useTranslation } from "react-i18next"

const FeedbackMessageBox = ({ message }: { message: FeedbackMessage }) => {
  const { t } = useTranslation()

  return (
    <div
      className={css`
        margin-top: 0.7rem;
        background-color: #f2f2f2;
        padding: 1rem;
        border-radius: 6px;

        svg {
          margin-right: 0.5rem;
          transform: scale(1.4);
          position: relative;
          top: 2px;
        }
      `}
    >
      <InfoIcon role="img" aria-label={t("feedback-message")} /> {message.text}
    </div>
  )
}

export default FeedbackMessageBox
