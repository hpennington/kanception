import BoardService from '../services/board-service'
import BoardRepositoryInterface from '../repositories/board-repository-interface'
import UserRepositoryInterface from '../repositories/user-repository-interface'
import GroupRepositoryInterface from '../repositories/group-repository-interface'
import AssignmentRepositoryInterface from '../repositories/assignment-repository-interface'
import CommentRepositoryInterface from '../repositories/comment-repository-interface'

class GroupService {
  private boardRepository: BoardRepositoryInterface
  private userRepository: UserRepositoryInterface
  private groupRepository: GroupRepositoryInterface
  private assignmentRepository: AssignmentRepositoryInterface
  private commentRepository: CommentRepositoryInterface
  private boardService: BoardService

  constructor(
    boardRepository: BoardRepositoryInterface,
    userRepository: UserRepositoryInterface,
    groupRepository: GroupRepositoryInterface,
    assignmentRepository: AssignmentRepositoryInterface,
    commentRepository: CommentRepositoryInterface,
    boardService: BoardService,
  ) {
    this.boardRepository = boardRepository
    this.userRepository = userRepository
    this.groupRepository = groupRepository
    this.assignmentRepository = assignmentRepository
    this.commentRepository = commentRepository
    this.boardService = boardService
  }

  public async createGroup(sub, boardId) {
    try {
      const ownerObject = await this.userRepository.findOne({sub: sub})
      const owner = ownerObject._id
      const board = await this.boardRepository.find(boardId)
      const currentGroups = await this.groupRepository.findAll({board: boardId})
      const order = Math.max(...[-1, ...currentGroups.map(group => group.order)]) + 1
      const group = await this.groupRepository.create('', owner, order, boardId)
      return group

    } catch(error) {
      throw error
    }
  }

  public async readGroups(boardId) {
    try {
      const groups = await this.groupRepository.findAll({board: boardId})
      return groups
    } catch(error) {
      throw error
    }
  }

  public async updateGroup(groupId, body) {
    try {
      const group = await this.groupRepository.find(groupId)
      const updatedGroup = Object.assign(group, body)
      updatedGroup.save()
      return updatedGroup

    } catch(error) {
      throw error
    }

  }

  public async deleteGroup(sub, id) {
    try {

      const user = await this.userRepository.findOne({sub: sub})
      const group = await this.groupRepository.find(id)

      if (group.owner == user._id) {
        const deleteResult = await this.groupRepository.delete(id)
        const boards = await this.boardRepository.findAll({group: id})
        if (boards.length > 0) {
          await this.boardService.recursiveDelete(boards.map(board => board._id))
        }
        return true
      } else {
        return false
      }

    } catch(error) {
      throw error
    }
  }
}

export default GroupService