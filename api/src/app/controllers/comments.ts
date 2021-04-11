import CommentService from '../services/comment-service'
import SocketIO from 'socket.io'

class CommentController {
  private commentService: CommentService
  private io: any

  constructor(commentService: CommentService, io: any) {
    this.commentService = commentService
    this.io = io

    this.createComment = this.createComment.bind(this)
    this.readComments = this.readComments.bind(this)
  }

  public async createComment(req, res) {
    try {
      const text = req.query.text
      const boardId = req.query.board
      const sub = req.user.sub
      
      const comment = await this.commentService.createComment(text, boardId, sub)
      this.io.to(boardId + '_comments').emit('create_comment', {comment})
      res.send(comment)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async readComments(req, res) {
  	try {
      const boardId = req.query.board
      const sub = req.user.sub

      const comments = await this.commentService.readComments(sub, boardId)

      if (comments != null) {
        res.send(comments)  
      } else {
        res.sendStatus(500)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default CommentController
