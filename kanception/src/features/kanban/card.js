import React, { useEffect, useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TextAreaAutoSize from 'react-textarea-autosize'
import './card.css'

const Card = props => {
  const container = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (mounted !== true) {
      document.getElementById(props.id).oncontextmenu = e => {
        console.log('card context menu')
        e.preventDefault()
        e.stopPropagation()

        props.onContextClick(props.id, e)
      }

      setMounted(true)
    }
  })

  console.log('count: ' + props.count)

  return (
    <Draggable
      draggableId={props.id} index={props.index}
    >
      {provided => (
      <div className="kanception-card"
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        onClick={e => props.onCardClick(e.target.id)}
        id={props.id}
      >
        <TextAreaAutoSize
          data-card-id={props.id}
          onClick={e => e.stopPropagation()}
          onChange={props.onUpdateCardTitle}
          placeholder="Write to-do..."
          style={{
            color: "white",
            background: "inherit",
            border: "none",
            textAlign: "center",
            resize: "none",
          }}
          value={props.title}
        />
        <span
          style={{
            fontSize: "0.75em",
            margin: "5px",
          }}
        >
          {props.count > 0 ? props.count + " cards" : ""}
        </span>
      </div>
      )}
    </Draggable>
  )
}

export default Card
