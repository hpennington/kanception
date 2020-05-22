import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TextAreaAutoSize from 'react-textarea-autosize'
import './card.css'

export default function Card(props) {
  return (
    <Draggable
      draggableId={'card-' + props.column.toString() + props.index.toString()} index={props.index}
    >
      {provided => (
      <div className="kanception-card"
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        id={props.id}
        onClick={e => props.onCardClick(e.target.id)}
      >
        <TextAreaAutoSize
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
      </div>
      )}
    </Draggable>
  )
}
