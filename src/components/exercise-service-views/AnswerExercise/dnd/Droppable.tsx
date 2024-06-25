import React from "react"
import { useDroppable } from "@dnd-kit/core"
import { css } from "@emotion/css"

export interface DroppableProps {
  itemId: string
  nthPlaceholder: number
}

const Droppable: React.FC<React.PropsWithChildren<DroppableProps>> = (
  props,
) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${props.itemId}-${props.nthPlaceholder}`,
    data: {
      itemId: props.itemId,
      nthPlaceholder: props.nthPlaceholder,
    } satisfies DroppableProps,
  })

  return (
    <span
      ref={setNodeRef}
      className={css`
        border: 2px dashed #949ba4;
        color: white;
        padding: 0.2rem;
        min-width: 4rem;
        display: inline-block;
        margin: 0 0.4rem;

        ${isOver && `background-color: #f0f0f0;`}
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        {props.children ? props.children : <>&nbsp;</>}
      </div>
    </span>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDroppableProps(arg: any): arg is DroppableProps {
  return (
    arg.itemId !== undefined &&
    arg.nthPlaceholder !== undefined &&
    typeof arg.itemId === "string" &&
    typeof arg.nthPlaceholder === "number"
  )
}

export default Droppable
