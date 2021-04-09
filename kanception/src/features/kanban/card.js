import React, { useEffect, useRef, useState, useReducer } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TextAreaAutoSize from 'react-textarea-autosize'
import CardMemberView from './card-member-view'
import CommentIcon from './icon-comment.png'
import CommentsView from './comments-view'
import './card.css'

const Card = props => {
  const [mounted, setMounted] = useState(false)
  const [commentsViewOpen, setCommentsViewOpen] = useState(false)

  useEffect(() => {
    if (mounted !== true) {
      document.getElementById(props.id).oncontextmenu = e => {
        if (e.target.className.includes('context-click') === true) {
          console.log('card context menu')
          e.preventDefault()
          e.stopPropagation()

          props.onContextClick(props.id, e)
        }
      }

      setMounted(true)
    }
  })

  const nameToInitials = name => {
    return name.first.slice(0, 1).toUpperCase() + name.last.slice(0, 1).toUpperCase()
  }

  const onClose = e => {
    e.stopPropagation()
    setCommentsViewOpen(false)
    props.setDragEnabled(true)
  }

  return (
    <Draggable
      draggableId={props.id} index={props.index}
      data-card-id={props.id}
      isDragDisabled={!props.dragEnabled}
    >
      {provided => (
      <div className="kanception-card context-click"
        data-card-id={props.id}
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        onClick={e => {
          setCommentsViewOpen(true)
          props.setDragEnabled(false)
        }}
        id={props.id}
      >
        {
        commentsViewOpen === true &&
        <CommentsView
          onSubmitComment={text => props.onSubmitComment(text, props.id)}
          comments={props.comments}
          members={props.members}
          open={commentsViewOpen}
          title={props.title}
          description={props.description}
          setDescription={props.setDescription}
          timestamp={props.timestamp}
          onClose={onClose}
          board={props.id}
        />
        }
        <div style={{display: "flex", width: "100%"}} className="context-click">
          <TextAreaAutoSize
            className="context-click"
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
            className="go-into-btn context-click"
            data-card-id={props.id}
            onClick={e => props.onCardClick(e.target.dataset.cardId)}
          >
            <div
              className="context-click"
              data-card-id={props.id}
            >
            </div>
          </div>
        </div>
          <div
            data-card-id={props.id}
            onClick={e => e.preventDefault()}
            className="card-member-container context-click"
          >
          {
            props.assignees &&
            props.assignees.map(a => {
              return (
                <CardMemberView
                  text={props.members.find(m => m._id === a) != null && nameToInitials({first: props.members.find(m => m._id === a).firstName, last: props.members.find(m => m._id === a).lastName})}
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
          className="context-click"
        >
        {
        props.hasComments === true &&
        <img
          data-card-id={props.id}
          className="context-click"
          style={{height: "28px", width: "32px", margin: "5px"}}
          src={CommentIcon}
          alt="Comment icon"
        />
        }
        <span
          data-card-id={props.id}
          style={{
            fontSize: "0.75em",
            margin: `${props.count > 0 ? '5' : '0'}px`,
          }}
        >
          {props.count > 0
          ? <IconCards
              onCardClick={props.onCardClick}
              id={props.id} text={props.count.toString()} /> : ""}
        </span>
        </div>
        </div>
      </div>
      )}
    </Draggable>
  )
}

const IconCards = props => (
  <div
    className="icon-cards context-click"
    data-card-id={props.id}
    onClick={e => props.onCardClick(e.target.dataset.cardId)}
  >
    {props.text}
  </div>
)

export default Card
