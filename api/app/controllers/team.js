const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const createTeam = async (req, res) => {
  try {
    const owner = await User.findOne({sub: req.user.sub})
    if (owner === null) {
      res.sendStatus(500)
    }

    const team = await Team.create({
      owner: owner._id,
      title: req.query.title,
      members: [owner._id]
    })

    owner.spaces.push(team._id)
    owner.save()

    const groupBacklog = await Group.create({title: "Backlog", owner: team._id, order: 0})
    const groupTodo = await Group.create({title: "To-do", owner: team._id, order: 1})
    const groupInProgress = await Group.create({title: "In progress", owner: team._id, order: 2})
    const groupReview = await Group.create({title: "Review", owner: team._id, order: 3})
    const groupDone = await Group.create({title: "Done", owner: team._id, order: 4})

    const groups = [groupBacklog, groupTodo, groupInProgress, groupReview, groupDone]

    const teamRoot = await Board.create({
      title: req.query.title,
      owner: team._id,
      groups: groups.map(group => group._id),
      order: 0,
      parent: null,
      team: team._id,
      group: null,
      isTeamRoot: true,
      isUserRoot: false,
      count: 0,
      comments: false,
    })

    res.send(team)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const readTeamRootsChildren = async (req, res) => {
  const team = req.query.team

  try {

    const root = await Board.find({team: team, group: null})

    if (root.length === 0) {
      res.sendStatus(500)
      return
    }

    res.send(root)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
}

const readTeam = async (req, res) => {
  try {
    const owner = await User.findOne({sub: req.user.sub})
    if (owner === null) {
      res.sendStatus(500)
      return
    }

    const space = await Space.findById({_id: req.query.team})
    console.log(space)

    if (owner.spaces.includes(space._id) === false) {
      res.sendStatus(501)
      return
    }

    const team = await Team.findById(new ObjectId(space.team))

    if (team === null) {
      res.sendStatus(502)
      return
    }

    res.send(JSON.stringify(team))

  } catch (error) {
    console.log(error)
    res.sendStatus(503)
  }
}

const updateTeamBoardAccept = async (req, res) => {
  const board = req.query.board
  const parent = req.query.parent
  const team = req.query.team
  const group = req.query.group

  try {

    const user = await User.find({sub: req.user.sub})

    if (user.length === 0) {
      res.sendStatus(500)
      return
    }

    const checkBoardRefExists = await BoardRef.find({board: board, owner: user[0]._id})
    if (checkBoardRefExists.length > 0) {
      res.sendStatus(409)
      return
    }

    const boardRef = await BoardRef.create({
      board: board,
      owner: user[0]._id,
      parent: parent,
      team: team,
      group: group,
      isUserRoot: false,
      isTeamRoot: false,
    })

    res.send(boardRef)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { createTeam, readTeam, readTeamRootsChildren, updateTeamBoardAccept }