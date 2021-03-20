import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import CommentBox from './comment-box'
import CommentBoxSubmit from './comment-box-submit'
import { setComments } from '../comments/commentsSlice'
import { useAuth0 } from '../../react-auth0-spa'
import './comments-view.css'

const CommentsView = props => {
  const { getTokenSilently } = useAuth0()

  useEffect(() => {
    fetchComments()
  }, [props.board])

  const fetchComments = async () => {
    try {
      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/comments?board=' + props.board
      const result = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const comments = await result.json()
      props.dispatch(setComments({comments: comments}))

    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="comments-view-overlay">
      <div className="comments-view">
        <div className="comments-view-left">
          <h3>{props.title}</h3>
        </div>
        <div className="comments-view-right">
          <h3>Comments</h3>
          
          <CommentBoxSubmit onSubmit={props.onSubmitComment} />
          <div className="comments-box">
          {
          props.comments && props.comments.map(
          comment =>
            <CommentBox
              timestamp={comment.timestamp}
              name={props.members.find(m => m._id === comment.owner)?.name}
              text={comment.text}
            />
          )
          }
          </div>
        </div>
        <div className="comments-view-right-bar">
          <button onClick={props.onClose} className="close-comments-btn">
            <svg width="34px" height="34px" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    )
}

export default connect()(CommentsView)
