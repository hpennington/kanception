import React from 'react'
import TextAreaAutoSize from 'react-textarea-autosize'
import './comment-box-submit.css'

const CommentBoxSubmit = props => (
  <div className="comment-box comment-box-submit">
    <TextAreaAutoSize
      placeholder="Write comment..."
      style={{
        color: "white",
        background: "inherit",
        border: "none",
        textAlign: "start",
        resize: "none",
      }}
    />
    <button className="comment-submit-btn">
      Submit
    </button>
  </div>
)

export default CommentBoxSubmit
