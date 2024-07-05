import useUserAnswerOutputState from "@/hooks/useUserAnswerOutputState"
import { ExerciseProps } from "."
import { css } from "@emotion/css"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import Droppable, { isDroppableProps } from "./dnd/Droppable"
import Draggable, { isDraggableProps } from "./dnd/Draggable"
import { UserAnswerDragging } from "@/protocolTypes/answer"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { PublicSpecOption } from "@/protocolTypes/publicSpec"
import useContainerWidth from "@/util/useContainerWidth"
import AccessibilityIcon from "@/assets/accessibility.svg"

const Dragging: React.FC<ExerciseProps> = ({ publicSpec }) => {
  const { t } = useTranslation()

  const { selected: answer, updateState: updateAnswer } =
    useUserAnswerOutputState<UserAnswerDragging>(
      (state) => state as UserAnswerDragging,
    )

  const usedOptions = useMemo(
    () =>
      answer?.itemAnswers
        .map((ia) => ia.selectedOptions)
        .filter((o) => !!o)
        .flat() || [],
    [answer],
  )

  const [accessibilityModeToggled, setAccessibilityModeToggled] =
    useState(false)
  const [containerRef, containerWidth] = useContainerWidth()
  const isNarrowScreen = useMemo(() => containerWidth < 700, [containerWidth])
  const showDropdowns = useMemo(() => {
    return isNarrowScreen || accessibilityModeToggled
  }, [accessibilityModeToggled, isNarrowScreen])

  const answerChanged = useCallback(
    (
      itemId: string,
      nthPlaceholder: number,
      option: PublicSpecOption | null,
    ) => {
      updateAnswer((answer) => {
        if (!answer) {
          throw new Error("Answer should have been initialized")
        }
        let itemAnswer = answer.itemAnswers.find((ia) => ia.itemId === itemId)
        if (!itemAnswer) {
          itemAnswer = {
            itemId: itemId,
            selectedOptions: [],
          }
          answer.itemAnswers.push(itemAnswer)
        }

        if (option) {
          // In case this was a moved answer, remove it from the old slot
          for (const ia of answer.itemAnswers) {
            const index = ia.selectedOptions.findIndex(
              (o) => o && o.id === option.id,
            )
            if (index !== -1) {
              ia.selectedOptions[index] = null
            }
          }
        }

        // This is smart in this case because js fills the gaps with null by default
        itemAnswer.selectedOptions[nthPlaceholder] = option
      })
    },
    [updateAnswer],
  )

  const handleDragEnd = useCallback(
    (dragEvent: DragEndEvent) => {
      const dragged = dragEvent.active.data.current
      if (!isDraggableProps(dragged)) {
        console.warn("Dropped non-draggable", dragged)
        return
      }
      if (!dragEvent.over) {
        // Dropped to nothingness, remove from the slot if part of answer
        updateAnswer((answer) => {
          if (!answer) {
            throw new Error("Answer should have been initialized")
          }
          answer.itemAnswers.forEach((ia) => {
            const index = ia.selectedOptions.findIndex(
              (o) => o && o.id === dragged.option.id,
            )
            if (index !== -1) {
              ia.selectedOptions[index] = null
            }
          })
        })

        return
      }

      const dropped = dragEvent.over.data.current
      if (!isDroppableProps(dropped)) {
        console.warn("Dropped on non-droppable", dropped)
        return
      }
      answerChanged(dropped.itemId, dropped.nthPlaceholder, dragged.option)
    },
    [answerChanged, updateAnswer],
  )

  const handleSelectedOptionOnDropdown = useCallback(
    (
      itemId: string,
      nthPlaceholder: number,
      selectedOption: PublicSpecOption | null,
    ) => {
      console.log(
        JSON.stringify(
          { itemId, nthPlaceholder, selectedOption },
          undefined,
          2,
        ),
      )
      answerChanged(itemId, nthPlaceholder, selectedOption)
    },
    [answerChanged],
  )

  const showNumbers = useMemo(() => {
    if (publicSpec.exerciseType !== "dragging") {
      return false
    }
    return publicSpec.items.length > 1
  }, [publicSpec])

  if (publicSpec.exerciseType !== "dragging" || !answer) {
    return null
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        {!isNarrowScreen && (
          <div
            className={css`
              display: flex;
              margin-bottom: 1rem;
              margin-top: -1rem;
            `}
          >
            <div
              className={css`
                flex-grow: 1;
              `}
            />

            <button
              className={css`
                color: white;
                background-color: #4c5767;
                padding: 0.3rem 0.5rem;
                border-radius: 0.4rem;
                border: none;
                cursor: pointer;

                &:hover {
                  filter: brightness(1.1) contrast(0.9);
                }

                svg {
                  width: 15px;
                  height: auto;
                  margin-right: 0.3rem;
                  position: relative;
                  top: 1px;
                }
              `}
              onClick={() =>
                setAccessibilityModeToggled(!accessibilityModeToggled)
              }
            >
              <AccessibilityIcon />
              {accessibilityModeToggled
                ? t("exit-accessible-mode")
                : t("accessible-mode")}
            </button>
          </div>
        )}
        <div
          className={css`
            display: flex;
            flex-gap: 1rem;
          `}
          ref={containerRef}
        >
          <div
            className={css`
              flex-grow: 1;
            `}
          >
            {publicSpec.items.map((item, n) => {
              let placeHolderCounter = -1
              return (
                <div
                  key={`public-spec-item-${item.id}`}
                  className={css`
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    margin-bottom: 1rem;

                    &:last-of-type {
                      margin-bottom: 0;
                    }
                  `}
                >
                  {showNumbers && (
                    <div
                      className={css`
                        align-self: flex-start;
                        position: relative;
                        top: 4px;
                        color: #333;
                      `}
                    >
                      {n + 1}.{" "}
                    </div>
                  )}
                  <div>
                    {item.textParts.map((textPart, n) => {
                      if (textPart.type === "text") {
                        return (
                          <span
                            key={`text-part-${textPart.text}-${n}-${item.id}`}
                          >
                            {textPart.text.trim()}
                          </span>
                        )
                      }
                      placeHolderCounter += 1
                      const nthPlaceholder = placeHolderCounter
                      const itemAnswer = answer.itemAnswers.find(
                        (ia) => ia.itemId === item.id,
                      )
                      const selectedOption =
                        itemAnswer?.selectedOptions[placeHolderCounter]
                      if (showDropdowns) {
                        const visibleOptions = publicSpec.allOptions.filter(
                          (o) => {
                            if (o.id === selectedOption?.id) {
                              return true
                            }
                            return !usedOptions.find(
                              (uo) => uo && uo.id === o.id,
                            )
                          },
                        )
                        return (
                          <select
                            className={css`
                              margin: 0.2rem 0.5rem;
                            `}
                            value={selectedOption?.id || ""}
                            onChange={(e) => {
                              const selectedValue = e.target.value
                              const option = publicSpec.allOptions.find(
                                (option) => option.id === selectedValue,
                              )
                              handleSelectedOptionOnDropdown(
                                item.id,
                                nthPlaceholder,
                                option ?? null,
                              )
                            }}
                          >
                            <option value="">{t("select-an-option")}</option>
                            {visibleOptions.map((option) => {
                              return (
                                <option
                                  key={`option-dropdown-entry-${option.id}-${nthPlaceholder}`}
                                  value={option.id}
                                >
                                  {option.text}
                                </option>
                              )
                            })}
                          </select>
                        )
                      }

                      let draggable = undefined
                      if (selectedOption) {
                        draggable = (
                          <Draggable
                            option={selectedOption}
                            key={`draggable-in-slot-${selectedOption.id}`}
                          />
                        )
                      }

                      return (
                        <Droppable
                          itemId={item.id}
                          nthPlaceholder={nthPlaceholder}
                          key={`droppable-slot-${item.id}-${nthPlaceholder}`}
                          children={draggable}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          {!showDropdowns && (
            <div>
              {publicSpec.allOptions.map((option) => {
                if (usedOptions.find((o) => o && o.id === option.id)) {
                  return null
                }
                return (
                  <Draggable
                    option={option}
                    key={`draggable-sidebar-${option.id}`}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DndContext>
  )
}

export default Dragging
