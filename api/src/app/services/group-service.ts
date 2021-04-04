const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
import BoardService from '../services/board-service'
import MongoBoardRepository from '../repositories/mongo-board-repository'
import MongoUserRepository from '../repositories/mongo-user-repository'
import MongoGroupRepository from '../repositories/mongo-group-repository'
import MongoAssignmentRepository from '../repositories/mongo-assignment-repository'
import MongoCommentRepository from '../repositories/mongo-comment-repository'
const ObjectId = mongoose.Types.ObjectId

class GroupService {
  private boardService: BoardService

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

  }

  public async createGroup(sub, boardId) {
    try {
      const ownerObject = await User.findOne({sub: sub})
      const owner = ownerObject._id
      const board = await Board.findById(new ObjectId(boardId))
      const currentGroups = await Group.find({board: boardId})
      const order = Math.max(...[-1, ...currentGroups.map(group => group.order)]) + 1
      const group = await Group.create({owner: owner, title: '', order: order, board: boardId})
      return group

    } catch(error) {
      throw error
    }
  }

  public async readGroups(boardId) {
    try {
      const groups = await Group.find({board: boardId})
      return groups
    } catch(error) {
      throw error
    }
  }

  public async updateGroup(groupId, body) {
    try {
      const group = await Group.findById(new ObjectId(groupId))
      const updatedGroup = Object.assign(group, body)
      updatedGroup.save()
      return updatedGroup

    } catch(error) {
      throw error
    }

  }

  public async deleteGroup(sub, id) {
    try {

      const user = await User.findOne({sub: sub})
      const group = await Group.findById(new ObjectId(id))

      if (group.owner == user._id) {
        const deleteResult = await Group.deleteOne({_id: id})
        const boards = await Board.find({group: id})
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