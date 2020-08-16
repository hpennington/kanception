import React from 'react'
import CardMemberView from './card-member-view'
import './comment-box.css'

const nameToInitials = name => {
  return name.first.slice(0, 1).toUpperCase()
    + name.last.slice(0, 1).toUpperCase()
}

const displayName = ({first, last}) => {
  return  first[0].toUpperCase() + first.slice(1)
    + ' '
    + last[0].toUpperCase() + last.slice(1)
}

const displayDate = timestamp => {
  const date = new Date(Math.floor(timestamp))
  return date.toLocaleString(undefined,
    {dateStyle: 'full', timeStyle: 'short'})
}

const CommentBox = props => (
  <div className="comment-box">
    <div className="user-box">
      <div style={{margin: "10px"}}>
      <CardMemberView
        text={nameToInitials(props.name)}
      />
      </div>
      <div>
        <p>
          {displayName(props.name)}
        </p>
        <p style={{fontSize: "0.75em"}}>
          {displayDate(props.timestamp)}
        </p>
      </div>
    </div>
    <p>{props.text}</p>
  </div>
)

export default CommentBox
