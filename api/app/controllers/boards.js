const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const BoardService = require('../services/board-service')
const ObjectId = mongoose.Types.ObjectId

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

    const owner = await User.findOne({sub: req.user.sub})

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

    await recursiveUpdateCount(parent, 1)

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
      const boardRef = await BoardRef.find({board: id})
      const board = await Board.findById(new ObjectId(id))

      boards.push({
        groups: board.groups,
        _id: board._id,
        title: board.title,
        owner: board.owner,
        order: board.order,
        group: boardRef[0].group,
        count: board.count,
      })
    }
  }

  res.send(boards)
}

const readBoards = async (req, res) => {
  const ids = req.query.ids

  const boards = []

  if (ids != null) {
    const user = await User.find({sub: req.user.sub})
    for (const id of ids) {
      const boardRef = await BoardRef.find({board: id, owner: user[0]._id})
      const board = await Board.findById(new ObjectId(id))

      // Add assignees to board
      const assigments = await Assignment.find({board: id})
      const assignees = assignments.map(assignment => assignment.assignee)

      boards.push({
        groups: board.groups,
        _id: board._id,
        title: board.title,
        description: board.description,
        owner: board.owner,
        order: board.order,
        group: boardRef[0].group,
        count: board.count,
        assignees: assignees,

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

const updateBoardRefs = async (req, res) => {

  try {
    const boardId = req.query.id
    const user = await User.find({sub: req.user.sub})
    const board = await BoardRef.find({board: boardId, owner: user[0]._id})
    const updatedBoard = Object.assign(board[0], req.body)
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

module.exports = { createBoard, readTeamBoards, readBoards, updateBoard, updateBoardRefs, deleteBoard }