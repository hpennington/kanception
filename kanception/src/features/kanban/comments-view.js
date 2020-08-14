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
        <h3>{props.title}</h3>
        <h4>{"Description text goes here but hasn't been implemented yet."}</h4>
        <CommentBoxSubmit onSubmit={props.onSubmitComment} />
        <div className="comments-box">
        {
        props.comments && props.comments.map(
        comment =>
          <CommentBox
            name={props.members.find(m => m._id === comment.owner)?.name}
            text={comment.text}
          />
        )
        }
        </div>
        <button onClick={props.onClose} className="close-comments-btn">Close</button>
      </div>
    </div>
    )
}

export default connect()(CommentsView)
