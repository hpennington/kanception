const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const BoardService = require('../services/board-service')
const ObjectId = mongoose.Types.ObjectId

class GroupController {

  public async createGroup(req, res) {
    try {
      const boardId = req.query.board
      const ownerObject = await User.findOne({sub: req.user.sub})
      const owner = ownerObject._id
      const board = await Board.findById(new ObjectId(boardId))
      const currentGroups = await Group.find({board: boardId})
      const order = Math.max(...[-1, ...currentGroups.map(group => group.order)]) + 1
      const group = await Group.create({owner: owner, title: '', order: order, board: boardId})

      res.send(group)
    } catch(error) {
      console.log(error)
    }
  }

  public async readGroups(req, res) {
    try {
      const boardId = req.query.board_id
      const groups = await Group.find({board: boardId})
      res.send(groups)
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async updateGroup(req, res) {
    try {
      const groupId = req.query.id
      const group = await Group.findById(new ObjectId(groupId))
      const updatedGroup = Object.assign(group, req.body)
      updatedGroup.save()
      res.sendStatus(201)

    } catch(error) {
      res.sendStatus(500)
    }

  }

  public async deleteGroup(req, res) {
    const id = req.query.id

    try {

      const user = await User.findOne({sub: req.user.sub})
      const group = await Group.findById(new ObjectId(id))

      if (group.owner == user._id) {
        const deleteResult = await Group.deleteOne({_id: id})
        const boards = await Board.find({group: id})
        if (boards.length > 0) {
          await new BoardService().recursiveDelete(boards.map(board => board._id))
        }
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