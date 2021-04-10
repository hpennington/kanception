import CommentService from '../services/comment-service'

class CommentController {
  private commentService: CommentService

  constructor(commentService: CommentService) {
    this.commentService = commentService

    this.createComment = this.createComment.bind(this)
    this.readComments = this.readComments.bind(this)
  }

  public async createComment(req, res) {
    try {
      const text = req.query.text
      const boardId = req.query.board
      const sub = req.user.sub
      
      const comment = await this.commentService.createComment(text, boardId, sub)
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
