import useUserAnswerOutputState from "@/hooks/useUserAnswerOutputState"
import { ExerciseProps } from "."
import { css } from "@emotion/css"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import Droppable, { isDroppableProps } from "./dnd/Droppable"
import Draggable, { isDraggableProps } from "./dnd/Draggable"
import { UserAnswerDragging } from "@/protocolTypes/answer"
import { useMemo } from "react"

const Dragging: React.FC<ExerciseProps> = ({ publicSpec }) => {
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

  if (publicSpec.exerciseType !== "dragging" || !answer) {
    return null
  }

  function handleDragEnd(dragEvent: DragEndEvent) {
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

    updateAnswer((answer) => {
      if (!answer) {
        throw new Error("Answer should have been initialized")
      }
      let itemAnswer = answer.itemAnswers.find(
        (ia) => ia.itemId === dropped.itemId,
      )
      if (!itemAnswer) {
        itemAnswer = {
          itemId: dropped.itemId,
          selectedOptions: [],
        }
        answer.itemAnswers.push(itemAnswer)
      }

      // In case this was a moved answer, remove it from the old slot
      for (const ia of answer.itemAnswers) {
        const index = ia.selectedOptions.findIndex(
          (o) => o && o.id === dragged.option.id,
        )
        if (index !== -1) {
          ia.selectedOptions[index] = null
        }
      }

      // This is smart in this case because js fills the gaps with undefined by default
      itemAnswer.selectedOptions[dropped.nthPlaceholder] = dragged.option
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className={css`
          display: flex;
          flex-gap: 1rem;
        `}
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
                key={item.id}
                className={css`
                  display: flex;
                  gap: 0.3rem;
                  align-items: center;
                `}
              >
                <div>{n + 1}. </div>
                <div>
                  {item.textParts.map((textPart) => {
                    if (textPart.type === "text") {
                      return (
                        <span key={textPart.text}>{textPart.text.trim()}</span>
                      )
                    }
                    placeHolderCounter += 1
                    const itemAnswer = answer.itemAnswers.find(
                      (ia) => ia.itemId === item.id,
                    )
                    const selectedOption =
                      itemAnswer?.selectedOptions[placeHolderCounter]
                    let draggable = undefined
                    if (selectedOption) {
                      draggable = (
                        <Draggable
                          option={selectedOption}
                          key={selectedOption.id}
                        />
                      )
                    }
                    return (
                      <Droppable
                        itemId={item.id}
                        nthPlaceholder={placeHolderCounter}
                        key={item.id}
                        children={draggable}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          {publicSpec.allOptions.map((option) => {
            if (usedOptions.includes(option)) {
              return null
            }
            return <Draggable option={option} key={option.id} />
          })}
        </div>
      </div>
    </DndContext>
  )
}

export default Dragging
