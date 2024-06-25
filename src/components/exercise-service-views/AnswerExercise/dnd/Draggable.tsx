import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { css } from "@emotion/css"
import { PublicSpecOption } from "@/protocolTypes/publicSpec"

export interface DraggableProps {
  option: PublicSpecOption
}

const Draggable: React.FC<DraggableProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${props.option.id}`,
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
      {props.option.text}
    </button>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDraggableProps(arg: any): arg is DraggableProps {
  return (
    arg.option !== undefined &&
    arg.option.id !== undefined &&
    arg.option.text !== undefined
  )
}

export default Draggable
