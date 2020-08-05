import React, { useEffect, useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TextAreaAutoSize from 'react-textarea-autosize'
import CardMemberView from './card-member-view'
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

  const nameToInitials = name => {
    return name.first.slice(0, 1).toUpperCase() + name.last.slice(0, 1).toUpperCase()
  }

  return (
    <Draggable
      draggableId={props.id} index={props.index}
      data-card-id={props.id}
    >
      {provided => (
      <div className="kanception-card"
        data-card-id={props.id}
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        onClick={e => props.onCardClick(e.target.dataset.cardId)}
        id={props.id}
      >
        <TextAreaAutoSize
          data-card-id={props.id}
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
          }}
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
        <div
          data-card-id={props.id}
          onClick={e => e.preventDefault()}
          className="card-member-container"
        >
        {
          props.assignees &&
          props.assignees.map(a => {
            return (
              <CardMemberView
                text={props.members && nameToInitials(props.members.find(m => m._id === a).name)}
              />
            )
          })
        }
        </div>
        <span
          data-card-id={props.id}
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
