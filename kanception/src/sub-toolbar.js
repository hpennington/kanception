import React from 'react'
import CommentIcon from './features/kanban/icon-comment.png'

const SubToolbar = props => {
  return (
    <div style={{marginTop: "60px", color: "dodgerblue", display: "flex", position: "fixed"}}>
      <img onClick={props.onCommentsClick} src={CommentIcon} width={"36px"} style={{margin: "10px", objectFit: "scale-down"}}></img>
      <h6 style={{margin: "10px"}}>{props.title}</h6>
    </div>
  )
}

export default SubToolbar