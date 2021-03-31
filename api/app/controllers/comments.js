const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const User = require('../models/user')
const Team = require('../models/team')
const Comment = require('../models/comment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const createComment = async (req, res) => {
  try {
    const text = req.query.text
    console.log({text})
    const boardId = req.query.board
    const timestamp = new Date().getTime()

    const user = await User.findOne({sub: req.user.sub})

    const comment = await Comment.create({
      text: text,
      owner: user._id,
      board: boardId,
      timestamp: timestamp,
    })

    const board = await Board.findById(new ObjectId(boardId))
    if (board.comments === false || board.comments === undefined) {
      board.comments = true
      board.save()
    }

    res.send(comment)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const readComments = async (req, res) => {
	try {
    const boardId = req.query.board

    const user = await User.findOne({sub: req.user.sub})
    const board = await Board.findById(new ObjectId(boardId))
    const project = await Project.findById(new ObjectId(board.project))
    const space = await Space.findById(new ObjectId(project.space))
    const team = await Team.findById(new ObjectId(space.team))

    if (team.members.includes(user._id)) {
      const comments = await Comment.find({board: boardId})
      res.send(comments.sort((a, b) => a.timestamp < b.timestamp))
    }
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { createComment, readComments }
