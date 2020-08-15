import React, { useState, useRef } from 'react'
import TextAreaAutoSize from 'react-textarea-autosize'
import './comment-box-submit.css'

const CommentBoxSubmit = props => {
  const [text, setText] = useState('')
  const textArea = useRef(null)

  return (
    <div className="comment-box comment-box-submit">
      <TextAreaAutoSize
        ref={textArea}
        placeholder="Write comment..."
        value={text}
        style={{
          color: "black",
          background: "inherit",
          border: "none",
          textAlign: "start",
          resize: "none",
        }}
        wrap="hard"
        onChange={e => {
          if (e.target.value.length < 1000) {
            setText(e.target.value)
          }
        }}
      />
      <button
        onClick={e => {
          if (text != '') {
            console.log({text: text.includes('\n')})
            console.log((text.match(/\n/g) || []).length)
            props.onSubmit(text)
            setText('')
          }
        }}
        className="comment-submit-btn"
      >
        Submit
      </button>
    </div>
  )
}

export default CommentBoxSubmit
