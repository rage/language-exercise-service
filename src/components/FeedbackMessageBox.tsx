import { FeedbackMessage } from "@/protocolTypes/privateSpec"
import InfoIcon from "@/assets/info.svg"
import { css } from "@emotion/css"

const FeedbackMessageBox = ({ message }: { message: FeedbackMessage }) => {
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
      <InfoIcon /> {message.text}
    </div>
  )
}

export default FeedbackMessageBox
