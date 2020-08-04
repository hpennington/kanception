import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react'

import './kanban.css'

const CardContextMenu = props => {
  const style = {
    visibility: props.isOpen === true ? 'visible' : 'hidden',
    top: props.position.y,
    left: props.position.x,
  }

  const onContextMenu = e => {
    e.preventDefault()
    props.onClose(e)
  }

  return (
    <div
      data-card-id={props.cardId}
      className="context-menu"
      style={style}
      onContextMenu={onContextMenu}
    >
      <h6 onClick={props.onCardDelete} className="border-bottom">Delete Card</h6>
      <h6 onClick={props.onCardAssignment}>Assignment</h6>
      <h6 onClick={props.onClose} className="border-top">Close</h6>
    </div>
  )
}

const GroupContextMenu = props => {
  const style = {
    visibility: props.isOpen === true ? 'visible' : 'hidden',
    top: props.position.y,
    left: props.position.x,
  }

  const onContextMenu = e => {
    e.preventDefault()
    props.onClose(e)
  }

  return (
    <div
      data-group-id={props.groupId}
      className="context-menu"
      style={style}
      onContextMenu={onContextMenu}
    >
      <h6 onClick={props.onGroupDelete} className="border-bottom">Delete Group</h6>
      <h6 onClick={props.onClose} className="border-top">Close</h6>
    </div>
  )
}

export { CardContextMenu, GroupContextMenu }
