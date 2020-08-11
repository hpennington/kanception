import React, { useEffect, useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TextAreaAutoSize from 'react-textarea-autosize'
import CardMemberView from './card-member-view'
import CommentIcon from './icon-comment.png'
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
        id={props.id}
      >
        <div style={{display: "flex", width: "100%"}}>
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
              textAlign: "start",
              resize: "none",
            }}
            value={props.title}
          />
          <div
            className="go-into-btn"
            data-card-id={props.id}
            onClick={e => props.onCardClick(e.target.dataset.cardId)}
          >
            <div
              data-card-id={props.id}
            >
            </div>
          </div>
        </div>
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
                  text={props.members.find(m => m._id === a) != null && nameToInitials(props.members.find(m => m._id === a).name)}
                />
              )
            })
          }
        <div style={{
            display: "flex",
            minWidth: `calc(100% - ${(props.assignees != undefined ? props.assignees.length : 0 % (5)) * 37 + 4}px)`,
            width: props.assignees && props.assignees.length > 0 ? "auto" : "100%",
            justifyContent: "flex-end",
          }}
        >
        {
        props.hasComments === true &&
        <img
          style={{height: "28px", width: "32px", margin: "5px"}}
          onClick={e => e.stopPropagation()}
          src={CommentIcon}
          alt="Comment icon"
        />
        }
        <span
          data-card-id={props.id}
          style={{
            fontSize: "0.75em",
            margin: "5px",
          }}
        >
          {props.count > 0 ? <IconCards text={props.count.toString()} /> : ""}
        </span>
        </div>
        </div>
      </div>
      )}
    </Draggable>
  )
}

const IconCards = props => (
  <div className="icon-cards">
    {props.text}
  </div>
)

export default Card
