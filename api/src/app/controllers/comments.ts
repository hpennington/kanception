import CommentService from '../services/comment-service'
import UserRepository from '../repositories/mongo/user-repository'
import CommentRepository from '../repositories/mongo/comment-repository'
import BoardRepository from '../repositories/mongo/board-repository'
import ProjectRepository from '../repositories/mongo/project-repository'
import SpaceRepository from '../repositories/mongo/space-repository'
import TeamRepository from '../repositories/mongo/team-repository'

class CommentController {
  private commentService: CommentService

  constructor() {
    const userRepository = new UserRepository()
    const commentRepository = new CommentRepository()
    const boardRepository = new BoardRepository()
    const projectRepository = new ProjectRepository()
    const spaceRepository = new SpaceRepository()
    const teamRepository = new TeamRepository()
    
    this.commentService = new CommentService(
      userRepository,
      commentRepository,
      boardRepository,
      projectRepository,
      spaceRepository,
      teamRepository,
    )

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
      res.send(comments)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default CommentController
