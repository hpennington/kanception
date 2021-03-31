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
import MongoBoardRepository from '../repositories/mongo-board-repository'

class BoardService {
  boardRepository: BoardRepositoryInterface

  constructor() {
    this.boardRepository = new MongoBoardRepository()
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

        const board = await Board.findById(new ObjectId(currentId))
        await board.update({$inc: {count: amount}})
        board.save()
        console.log({board})

        currentId = board.parent

       } while(currentId !== null)

    } catch(error) {
      throw error
    }
  }

  async createBoard(project, group, parent, sub) {
    try {

      const owner = await User.findOne({sub: sub})
      const boards = await Board.find({group: group})
      const order = Math.max(...[-1, ...boards.map(board => board.order)]) + 1

      const board = await Board.create({
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

      const groupBacklog = await Group.create({
        title: "Backlog",
        owner: owner._id,
        order: 0,
        board: board._id,
      })

      const groupTodo = await Group.create({
        title: "To-do",
        owner: owner._id,
        order: 1,
        board: board._id,
      })

      const groupInProgress = await Group.create({
        title: "In progress",
        owner: owner._id,
        order: 2,
        board: board._id,
      })

      const groupReview = await Group.create({
        title: "Review",
        owner: owner._id,
        order: 3,
        board: board._id,
      })

      const groupDone = await Group.create({
        title: "Done",
        owner: owner._id,
        order: 4,
        board: board._id,
      })

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
    const owner = await User.findOne({sub: sub})
    const nodes = await Board.find({project: project})
    const updatedNodes = []

    for (var node of nodes) {
      // Add assignees to board
      const assignments = await Assignment.find({board: node._id})
      const assignees = assignments.map(assignment => assignment.assignee)

      updatedNodes.push({
        _id: node._id,
        assignees: assignees,
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
      })
    }

    return updatedNodes
  }
}

module.exports = BoardService