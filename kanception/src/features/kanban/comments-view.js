import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import CommentBox from './comment-box'
import CommentBoxSubmit from './comment-box-submit'
import TextAreaAutoSize from 'react-textarea-autosize'
import { setComments } from '../comments/commentsSlice'
import { useAuth0 } from '../../react-auth0-spa'
import { io } from 'socket.io-client'
import './comments-view.css'

const CommentsView = props => {
  const { getTokenSilently } = useAuth0()


  useEffect(() => {
    getTokenSilently()
      .then(token => {

        const socket = io.connect('wss://api.kanception.io', {
          "transports": ['websocket'],
        })

        socket.on('connect_error', (error) => {
          console.log(error)
        })

        socket.on('connect', () => {
          console.log('on connect')
          socket.emit('authenticate_comments', { token: token, board: props.board })
        })

        socket.on('send_comments', (data) => {
          console.log('send_comments')
          console.log(data.comments)
          props.dispatch(setComments({comments: data.comments}))
        })
        
        socket.on('create_comment', (data) => {
          console.log('test')
          console.log({data})
          const currentCommentIds = props.comments.map(comment => comment._id)
          if (currentCommentIds.includes(data.comment._id) === false) {
            props.onSubmitComment(data.comment, props.board)
          }
        })
      })
    
  }, [props.board])

  const onSubmitComment = async text => {
    const token = await getTokenSilently()
    const url = process.env.REACT_APP_API + '/comments'
      + '?text=' + text.replace(/\n/g, '%0A')
      + '&board=' + props.board
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const comment = await result.json()
    // await props.onSubmitComment(comment, props.board)
  }

  return (
    <div className="comments-view-overlay">
      <div className="comments-view">
          <button onClick={props.onClose} className="close-comments-btn close-comments-btn-mobile">
            <svg width="34px" height="34px" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        <div className="comments-view-left">
          <h3>{props.title}</h3>
          <TextAreaAutoSize
            placeholder="Description..."
            value={props.description}
            style={{
              color: "black",
              background: "white",
              border: "none",
              textAlign: "start",
              resize: "none",
              borderRadius: "5px",
              minHeight: "100px",
              padding: "10px",
              width: "100%",
              margin: "10px auto",
            }}
            wrap="hard"
            onChange={e => {
              if (e.target.value.length < 10000) {
                props.setDescription(e.target.value)
              }
            }}>
          </TextAreaAutoSize>
        </div>
        <div className="comments-view-right">
          <h3>Comments</h3>
          
          <CommentBoxSubmit onSubmit={onSubmitComment} />
          <div className="comments-box">
          {
          props.comments && props.comments.map(
          comment =>
            <CommentBox
              timestamp={comment.timestamp}
              name={{
                first: props.members.find(m => m._id === comment.owner)?.firstName,
                last: props.members.find(m => m._id === comment.owner)?.lastName
              }}
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
