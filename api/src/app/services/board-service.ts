import { uuid }from 'uuidv4'
import BoardRepositoryInterface from '../repositories/board-repository-interface'
import UserRepositoryInterface from '../repositories/user-repository-interface'
import GroupRepositoryInterface from '../repositories/group-repository-interface'
import AssignmentRepositoryInterface from '../repositories/assignment-repository-interface'
import CommentRepositoryInterface from '../repositories/comment-repository-interface'

class BoardService {
  private boardRepository: BoardRepositoryInterface
  private userRepository: UserRepositoryInterface
  private groupRepository: GroupRepositoryInterface
  private assignmentRepository: AssignmentRepositoryInterface
  private commentRepository: CommentRepositoryInterface

  constructor(
    boardRepository: BoardRepositoryInterface,
    userRepository: UserRepositoryInterface,
    groupRepository: GroupRepositoryInterface,
    assignmentRepository: AssignmentRepositoryInterface,
    commentRepository: CommentRepositoryInterface,
  ) {
    this.boardRepository = boardRepository
    this.userRepository = userRepository
    this.groupRepository = groupRepository
    this.assignmentRepository = assignmentRepository
    this.commentRepository = commentRepository
  }

  public async recursiveDelete(ids) {
    for (const id of ids) {
      await this.assignmentRepository.deleteMany({board: id})
      await this.commentRepository.deleteMany({board: id})
      await this.boardRepository.delete(id)
      const children = await this.boardRepository.findByParent(id)
      
      const childrenIds = children.map(child => child._id)
      if (childrenIds.length > 0) {
        this.recursiveDelete(childrenIds)
      } else {
        return
      }
    }
  }

  private async recursiveUpdateCount(id, amount) {
    try {

      let currentId = id
      do {

        const board = await this.boardRepository.find(currentId)
        await this.boardRepository.incrementCount(board, amount)

        currentId = board.parent

       } while(currentId !== null)

    } catch(error) {
      throw error
    }
  }

  public async createBoard(project, group, parent, sub) {
    try {

      const owner = await this.userRepository.findOne({sub: sub})
      const boards = await this.boardRepository.findAll({group: group})
      const order = Math.max(...[-1, ...boards.map(board => board.order)]) + 1
      const board = await this.boardRepository.create({
        _id: uuid(),
        title: "",
        description: "",
        owner: owner._id,
        order: order,
        project: project,
        parent: parent,
        group: group,
        count: 0,
        comments: false,
      })
      const groupBacklog = await this.groupRepository.create("Backlog", owner, 0, board)
      const groupTodo = await this.groupRepository.create("To-do", owner, 1, board)
      const groupInProgress = await this.groupRepository.create("In progress", owner, 2, board)
      const groupReview = await this.groupRepository.create("Review", owner, 3, board)
      const groupDone = await this.groupRepository.create("Done", owner, 4, board)

      const groups = [
        groupBacklog,
        groupTodo,
        groupInProgress,
        groupReview,
        groupDone
      ]

      await this.recursiveUpdateCount(parent, 1)

      return board

    } catch(error) {
      throw error
    }
  }

  public async readTree(sub, project) {
    const owner = await this.userRepository.findOne({sub: sub})
    const nodes = await this.boardRepository.findAll({project: project})

    const updatedNodes = []

    for (var node of nodes) {
      // Add assignees to board
      const assignments = await this.assignmentRepository.findAll({board: node._id})
      const assignees = assignments.map(assignment => assignment.assignee)

      node.assignees = assignees
      updatedNodes.push(node)
    }

    return updatedNodes
  }

  public async updateBoard(id, body) {
    const board = await this.boardRepository.find(id)
    const result = await this.boardRepository.merge(board, body)
    return result
  }

  public async deleteBoard(id, sub) {
    const user = await this.userRepository.findOne({sub: sub})
    const board = await this.boardRepository.find(id)

    if (board.owner == user._id) {
      if (board.parent !== null) {
        await this.recursiveUpdateCount(board.parent, -1)
      }

      await this.recursiveDelete([id])

      return true
    } else {
      return false
    }
  }
}

export default BoardService