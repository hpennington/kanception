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
        <select
          className="share-select"
          data-card-id={props.id}
          onChange={e =>
            props.onTeamChange(
              e.target.children[e.target.selectedIndex].dataset.teamId,
              e.target.dataset.cardId
            )
          }>
          <option data-team-id="private">Private</option>
          {
          props.teams.map(team =>
            <option data-team-id={team._id}>{team.title}</option>
          )
          }
        </select>
      </div>
      )}
    </Draggable>
  )
}

export default Card
