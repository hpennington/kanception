import MongoBoardRepository from '../repositories/mongo/board-repository'
import MongoUserRepository from '../repositories/mongo/user-repository'
import MongoGroupRepository from '../repositories/mongo/group-repository'
import MongoAssignmentRepository from '../repositories/mongo/assignment-repository'
import MongoCommentRepository from '../repositories/mongo/comment-repository'
import BoardService from '../services/board-service'
import SpaceService from '../services/space-service'

class SpaceController {
  private boardService: BoardService
  private spaceService: SpaceService

  constructor() {
    const boardRepository = new MongoBoardRepository()
    const userRepository = new MongoUserRepository()
    const groupRepository = new MongoGroupRepository()
    const assignmentRepository = new MongoAssignmentRepository()
    const commentRepository = new MongoCommentRepository()
    const boardService = new BoardService(
      boardRepository, 
      userRepository, 
      groupRepository, 
      assignmentRepository, 
      commentRepository
    )

    this.boardService = boardService
    this.spaceService = new SpaceService()

    this.createSpace = this.createSpace.bind(this)
    this.readSpaces = this.readSpaces.bind(this)
    this.deleteSpace = this.deleteSpace.bind(this)
  }

  public async createSpace(req, res) {
    try {

      const title = req.query.title
      const sub = req.user.sub

      const space = await this.spaceService.createSpace(sub, title)
      res.send(space)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async readSpaces(req, res) {
  	try {
      const sub = req.user.sub
      const spaces = await this.spaceService.readSpaces(sub)

  	  res.send(spaces)

  	} catch(error) {
  	  console.log(error)
  	  res.sendStatus(500)
  	}
  }

  public async deleteSpace(req, res) {
    const id = req.query.id
    const sub = req.user.sub
    try {

      const result = await this.spaceService.deleteSpace(sub, id)

      
      if (result === false) {
        res.sendStatus(401)
        return
      }

      // res.sendState('201')
      
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default SpaceController