import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { css } from "@emotion/css"

export interface DraggableProps {
  option: string
  n: number
}

const Draggable: React.FC<DraggableProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${props.n}-${props.option}`,
    data: props,
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <button
      ref={setNodeRef}
      style={style}
      className={css`
        cursor: grab;
        margin: 0.1rem;
        display: block;
      `}
      {...listeners}
      {...attributes}
    >
      {props.option}
    </button>
  )
}

export function isDraggableProps(arg: any): arg is DraggableProps {
  return (
    arg.option !== undefined &&
    arg.n !== undefined &&
    typeof arg.option === "string" &&
    typeof arg.n === "number"
  )
}

export default Draggable
