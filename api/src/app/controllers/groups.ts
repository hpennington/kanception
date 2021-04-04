const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
import MongoBoardRepository from '../repositories/mongo/board-repository'
import MongoUserRepository from '../repositories/mongo/user-repository'
import MongoGroupRepository from '../repositories/mongo/group-repository'
import MongoAssignmentRepository from '../repositories/mongo/assignment-repository'
import MongoCommentRepository from '../repositories/mongo/comment-repository'
import BoardService from '../services/board-service'
import GroupService from '../services/group-service'
const ObjectId = mongoose.Types.ObjectId

class GroupController {
  private groupService: GroupService
  private boardService: BoardService
  
  constructor() {
    this.groupService = new GroupService()

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