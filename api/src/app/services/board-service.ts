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
      const groupBacklog = await this.groupRepository.create("Backlog", owner._id, 0, board._id)
      const groupTodo = await this.groupRepository.create("To-do", owner._id, 1, board._id)
      const groupInProgress = await this.groupRepository.create("In progress", owner._id, 2, board._id)
      const groupReview = await this.groupRepository.create("Review", owner._id, 3, board._id)
      const groupDone = await this.groupRepository.create("Done", owner._id, 4, board._id)

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
      console.log(node._id)
      const assignments = await this.assignmentRepository.findAll({board: node._id})
      console.log({assignments})
      const assignees = assignments.map(assignment => assignment.assignee)

      updatedNodes.push({
        _id: node._id,
        title: node.title,
        description: node.description,
        project: node.project,
        owner: node.owner,
        parent: node.parent,
        group: node.group,
        order: node.order,
        start: node.start,
        end: node.end,
        count: node.count,
        comments: node.comments,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        assignees: assignees,
      })
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