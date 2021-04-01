const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const BoardService = require('../services/board-service')
const ObjectId = mongoose.Types.ObjectId
import MongoBoardRepository from '../repositories/mongo-board-repository'
import MongoUserRepository from '../repositories/mongo-user-repository'
import MongoGroupRepository from '../repositories/mongo-group-repository'

const recursiveUpdateCount = async (id, amount) => {
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
    console.log(error)
    throw error
  }
}

const createBoard = async (req, res) => {
  try {

    const project = req.query.project
    const group = req.query.group
    const parent = req.query.parent
    const sub = req.user.sub

    const boardRepository = new MongoBoardRepository()
    const userRepository = new MongoUserRepository()
    const groupRepository = new MongoGroupRepository()
    const boardService = new BoardService(boardRepository, userRepository, groupRepository)

    const board = await boardService.createBoard(project, group, parent, sub)

    res.send(board)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const readTeamBoards = async (req, res) => {
  const ids = req.query.ids

  const boards = []

  if (ids != null) {
    for (const id of ids) {
      // const boardRef = await BoardRef.find({board: id})
      const board = await Board.findById(new ObjectId(id))

      boards.push({
        groups: board.groups,
        _id: board._id,
        title: board.title,
        owner: board.owner,
        order: board.order,
        group: board.group,
        count: board.count,
      })
    }
  }

  res.send(boards)
}

const updateBoard = async (req, res) => {

  try {
    const boardId = req.query.id
    const board = await Board.findById(new ObjectId(boardId))
    const updatedBoard = Object.assign(board, req.body)
    console.log('updatedboard: ' + board)
    updatedBoard.save()
    res.sendStatus(201)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }

}

const deleteBoard = async (req, res) => {
  const id = req.query.id

  try {

    const user = await User.findOne({sub: req.user.sub})
    const board = await Board.findById(new ObjectId(id))

    console.log(board.owner)
    console.log(user._id)
    if (board.owner == user._id) {
      if (board.parent !== null) {
        await recursiveUpdateCount(board.parent, -1)
      }

      await new BoardService().recursiveDelete([id])

      res.sendStatus(201)
    } else {
      res.sendStatus(403)
    }

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { createBoard, readTeamBoards, updateBoard, deleteBoard }