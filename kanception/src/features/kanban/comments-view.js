import React from 'react'
import CommentBox from './comment-box'
import CommentBoxSubmit from './comment-box-submit'
import './comments-view.css'

const CommentsView = props => (
  <div className="comments-view-overlay">
    <div className="comments-view">
      <h3>{props.title}</h3>
      <h4>{"Description text goes here but hasn't been implemented yet."}</h4>
      <CommentBoxSubmit />
      <CommentBox />
      <button onClick={props.onClose} className="close-comments-btn">Close</button>
    </div>
  </div>
)

export default CommentsView
