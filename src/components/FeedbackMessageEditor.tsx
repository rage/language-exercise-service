import {
  FeedbackMessage,
  FeedbackMessageCorrectness,
  FeedbackMessageVisibility,
} from "@/protocolTypes/privateSpec"
import { css } from "@emotion/css"
import { useEffect } from "react"
import { v4 } from "uuid"
import Collapsable from "./Collapsable"
import { useTranslation } from "react-i18next"

interface FeedbackMessageEditorProps {
  feedbackMessages: FeedbackMessage[] | undefined
  setFeedbackMessages: (feedbackMessages: FeedbackMessage[]) => void
}

const FeedbackMessageEditor: React.FC<FeedbackMessageEditorProps> = ({
  feedbackMessages,
  setFeedbackMessages,
}) => {
  const { t } = useTranslation()
  useEffect(() => {
    if (feedbackMessages === undefined) {
      setFeedbackMessages([])
    }
  }, [feedbackMessages, setFeedbackMessages])

  if (!feedbackMessages) {
    return null
  }
  return (
    <div
      className={css`
        margin: 1rem 0;
      `}
    >
      <Collapsable title={`Feedback messages (${feedbackMessages.length})`}>
        {feedbackMessages.length > 0 && (
          <div>
            <div>
              {feedbackMessages.map((feedbackMessage) => (
                <div
                  className={css`
                    border: 1px solid #ccc;
                    padding: 1rem;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                    margin: 1rem 0;
                    background-color: #fafafa;
                  `}
                  key={feedbackMessage.id}
                >
                  <div
                    className={css`
                      display: flex;
                      gap: 1rem;
                    `}
                  >
                    <label>
                      {t("visibility")}{" "}
                      <select
                        value={feedbackMessage.visibility}
                        onChange={(e) => {
                          setFeedbackMessages(
                            feedbackMessages.map((fm) => {
                              if (fm.id === feedbackMessage.id) {
                                return {
                                  ...fm,
                                  visibility: e.target
                                    .value as FeedbackMessageVisibility,
                                }
                              }
                              return fm
                            }),
                          )
                        }}
                      >
                        {(
                          [
                            {
                              value: "model-solution",
                              label: "Model solution",
                            },
                            {
                              value: "before-model-solution",
                              label: "Before model solution",
                            },
                          ] satisfies {
                            value: FeedbackMessageVisibility
                            label: string
                          }[]
                        ).map(({ value, label }) => (
                          <option value={value}>{label}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      {t("correctness")}{" "}
                      <select
                        value={feedbackMessage.correctness}
                        onChange={(e) => {
                          setFeedbackMessages(
                            feedbackMessages.map((fm) => {
                              if (fm.id === feedbackMessage.id) {
                                return {
                                  ...fm,
                                  correctness: e.target
                                    .value as FeedbackMessageCorrectness,
                                }
                              }
                              return fm
                            }),
                          )
                        }}
                      >
                        {(
                          [
                            { value: "correct", label: "Correct" },
                            {
                              value: "partially-correct",
                              label: "Partially correct",
                            },
                            { value: "incorrect", label: "Incorrect" },
                            { value: "any", label: "Any" },
                          ] satisfies {
                            value: FeedbackMessageCorrectness
                            label: string
                          }[]
                        ).map(({ value, label }) => (
                          <option value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                    <div
                      className={css`
                        flex: 1;
                      `}
                    ></div>
                    <button
                      onClick={() => {
                        setFeedbackMessages(
                          feedbackMessages.filter(
                            (fm) => fm.id !== feedbackMessage.id,
                          ),
                        )
                      }}
                    >
                      {t("remove")}
                    </button>
                  </div>
                  <div>
                    <label>
                      {t("message")}{" "}
                      <textarea
                        className={css`
                          width: 100%;
                          resize: vertical;
                        `}
                        value={feedbackMessage.text}
                        onChange={(e) => {
                          setFeedbackMessages(
                            feedbackMessages.map((fm) => {
                              if (fm.id === feedbackMessage.id) {
                                return {
                                  ...fm,
                                  text: e.target.value,
                                }
                              }
                              return fm
                            }),
                          )
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => {
            setFeedbackMessages([
              ...(feedbackMessages || []),
              {
                id: v4(),
                text: "",
                visibility: "model-solution",
                correctness: "incorrect",
              },
            ])
          }}
        >
          {t("add-feedback-message")}
        </button>
      </Collapsable>
    </div>
  )
}

export default FeedbackMessageEditor
