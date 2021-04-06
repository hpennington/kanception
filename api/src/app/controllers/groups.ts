import GroupService from '../services/group-service'
import BoardService from '../services/board-service'
import BoardRepository from '../repositories/mongo/board-repository'
import UserRepository from '../repositories/mongo/user-repository'
import GroupRepository from '../repositories/mongo/group-repository'
import AssignmentRepository from '../repositories/mongo/assignment-repository'
import CommentRepository from '../repositories/mongo/comment-repository'

class GroupController {
  private groupService: GroupService
  
  constructor() {
    const boardRepository = new BoardRepository()
    const userRepository = new UserRepository()
    const groupRepository = new GroupRepository()
    const assignmentRepository = new AssignmentRepository()
    const commentRepository = new CommentRepository()
    const boardService = new BoardService(
      boardRepository, 
      userRepository, 
      groupRepository, 
      assignmentRepository, 
      commentRepository
    )

    this.groupService = new GroupService(
      boardRepository,
      userRepository,
      groupRepository,
      assignmentRepository,
      commentRepository,
      boardService
    )

    this.createGroup = this.createGroup.bind(this)
    this.readGroups = this.readGroups.bind(this)
    this.updateGroup = this.updateGroup.bind(this)
    this.deleteGroup = this.deleteGroup.bind(this)
  }

  public async createGroup(req, res) {
    try {
      const boardId = req.query.board
      const sub = req.user.sub
      
      const group = await this.groupService.createGroup(sub, boardId)

      res.send(group)
    } catch(error) {
      console.log(error)
    }
  }

  public async readGroups(req, res) {
    try {
      const boardId = req.query.board_id
      const groups = await this.groupService.readGroups(boardId)
      res.send(groups)
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async updateGroup(req, res) {
    try {
      const groupId = req.query.id
      const body = req.body
      const group = await this.groupService.updateGroup(groupId, body)
      res.sendStatus(201)

    } catch(error) {
      res.sendStatus(500)
    }

  }

  public async deleteGroup(req, res) {
    const id = req.query.id
    const sub = req.user.sub

    try {

      const result = await this.groupService.deleteGroup(sub, id)

      if (result === true) {
        res.sendStatus(201)
      } else {
        res.sendStatus(403)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default GroupController