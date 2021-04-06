import SpaceService from '../services/space-service'
import BoardService from '../services/board-service'
import BoardRepository from '../repositories/mongo/board-repository'
import UserRepository from '../repositories/mongo/user-repository'
import GroupRepository from '../repositories/mongo/group-repository'
import AssignmentRepository from '../repositories/mongo/assignment-repository'
import CommentRepository from '../repositories/mongo/comment-repository'
import TeamRepository from '../repositories/mongo/team-repository'
import SpaceRepository from '../repositories/mongo/space-repository'
import ProjectRepository from '../repositories/mongo/project-repository'

class SpaceController {
  private spaceService: SpaceService

  constructor() {
    const boardRepository = new BoardRepository()
    const userRepository = new UserRepository()
    const groupRepository = new GroupRepository()
    const assignmentRepository = new AssignmentRepository()
    const commentRepository = new CommentRepository()
    const teamRepository = new TeamRepository()
    const spaceRepository = new SpaceRepository()
    const projectRepository = new ProjectRepository()
    const boardService = new BoardService(
      boardRepository, 
      userRepository, 
      groupRepository, 
      assignmentRepository, 
      commentRepository
    )

    this.spaceService = new SpaceService(
      boardRepository,
      userRepository,
      groupRepository,
      assignmentRepository,
      commentRepository,
      teamRepository,
      spaceRepository,
      projectRepository,
      boardService
    )

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