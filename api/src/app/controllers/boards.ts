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
const ObjectId = mongoose.Types.ObjectId

class BoardController {
  private boardService: BoardService

  constructor() {
    const boardRepository = new MongoBoardRepository()
    const userRepository = new MongoUserRepository()
    const groupRepository = new MongoGroupRepository()
    const assignmentRepository = new MongoAssignmentRepository()
    const boardService = new BoardService(boardRepository, userRepository, groupRepository, assignmentRepository)
    this.boardService = boardService

    this.createBoard = this.createBoard.bind(this)
    this.readTree = this.readTree.bind(this)
    this.updateBoard = this.updateBoard.bind(this)
    this.deleteBoard = this.deleteBoard.bind(this)
  }

  public async createBoard(req, res) {
    try {

      const project = req.query.project
      const group = req.query.group
      const parent = req.query.parent
      const sub = req.user.sub

      const board = await this.boardService.createBoard(project, group, parent, sub)

      res.send(board)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async readTree(req, res) {
    try {

      const project = req.query.project
      const sub = req.user.sub

      const nodes = await this.boardService.readTree(sub, project)

      res.send(nodes)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async updateBoard(req, res) {

    try {
      const boardId = req.query.id
      const body = req.body

      await this.boardService.updateBoard(boardId, body)

      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }

  }

  public async deleteBoard(req, res) {
    const id = req.query.id
    const sub = req.user.sub

    try {

      const success = await this.boardService.deleteBoard(id, sub)

      if (success === true) {
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

export default BoardController