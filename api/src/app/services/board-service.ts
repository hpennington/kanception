const Space = require('../models/space')
const Project = require('../models/project')
import Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const Assignment = require('../models/assignment')
const Comment = require('../models/comment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
import BoardRepositoryInterface from '../repositories/board-repository-interface'
import UserRepositoryInterface from '../repositories/user-repository-interface'
import GroupRepositoryInterface from '../repositories/group-repository-interface'
import AssignmentRepositoryInterface from '../repositories/assignment-repository-interface'

class BoardService {
  boardRepository: BoardRepositoryInterface
  userRepository: UserRepositoryInterface
  groupRepository: GroupRepositoryInterface
  assignmentRepository: AssignmentRepositoryInterface

  constructor(
    boardRepository: BoardRepositoryInterface,
    userRepository: UserRepositoryInterface,
    groupRepository: GroupRepositoryInterface,
    assignmentRepository: AssignmentRepositoryInterface,
  ) {
    this.boardRepository = boardRepository
    this.userRepository = userRepository
    this.groupRepository = groupRepository
    this.assignmentRepository = assignmentRepository
  }

  async recursiveDelete(ids) {
    for (const id of ids) {
      const deleteAssignementsResult = await Assignment.deleteMany({board: id})
      const deleteCommentsResult = await Comment.deleteMany({board: id})
      const deleteResult = await Board.deleteOne({_id: new ObjectId(id)})
      const children = await Board.find({parent: id})
      const childrenIds = children.map(child => child._id)
      if (childrenIds.length > 0) {
        this.recursiveDelete(childrenIds)
      } else {
        return
      }
    }
  }

  async recursiveUpdateCount(id, amount) {
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

  async createBoard(project, group, parent, sub) {
    try {

      const owner = await this.userRepository.findBySub(sub)
      const boards = await this.boardRepository.findAll({group: group})
      const order = Math.max(...[-1, ...boards.map(board => board.order)]) + 1

      const board = await this.boardRepository.create("", "", owner, order, project, parent, group, 0, false)

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

  async readTree(sub, project) {
    const owner = await this.userRepository.findBySub(sub)
    const nodes = await this.boardRepository.findAll({project: project})

    const updatedNodes = []

    for (var node of nodes) {
      // Add assignees to board
      const assignments = await this.assignmentRepository.findAllByBoard(node)
      const assignees = assignments.map(assignment => assignment.assignee)

      node.assignees = assignees
      updatedNodes.push(node)
    }

    return updatedNodes
  }
}

module.exports = BoardService