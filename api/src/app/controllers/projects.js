const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const TeamInvite = require('../models/team-invite')
const Assignment = require('../models/assignment')
const Comment = require('../models/comment')
const BoardService = require('../services/board-service')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const createProject = async (req, res) => {
  try {

    const title = req.query.title
    const space = req.query.space

    const owner = await User.findOne({sub: req.user.sub})
    const project = await Project.create({
      title: title,
      space: space,
      owner: owner._id,
    })

    console.log({project})

    const projectRoot = await Board.create({
      title: title,
      owner: owner._id,
      order: 0,
      parent: null,
      project: project._id,
      group: null,
      count: 0,
      comments: false,
    })

    const groupBacklog = await Group.create({
      title: "Backlog",
      owner: owner._id,
      order: 0,
      board: projectRoot._id,
    })

    const groupTodo = await Group.create({
      title: "To-do",
      owner: owner._id,
      order: 1,
      board: projectRoot._id,
    })

    const groupInProgress = await Group.create({
      title: "In progress",
      owner: owner._id,
      order: 2,
      board: projectRoot._id,
    })

    const groupReview = await Group.create({
      title: "Review",
      owner: owner._id,
      order: 3,
      board: projectRoot._id,
    })

    const groupDone = await Group.create({
      title: "Done",
      owner: owner._id,
      order: 4,
      board: projectRoot._id,
    })

    res.send(project)

  } catch(error) {
    console.log(error)
  }
}

const readProjects = async (req, res) => {
  try {

    const owner = await User.findOne({sub: req.user.sub})

    const projects = []

    for (const team of owner.spaces) {
      console.log(team)
      const space = await Space.findById(new ObjectId(team))
      console.log(space)
      const projectsResult = await Project.find({space: space._id})
      projects.push(...projectsResult)
    }

    res.send(projects)

  } catch(error) {
    console.log(error)
  }
}

const deleteProject = async (req, res) => {
  try {
    const id = req.query.id
    const owner = await User.findOne({sub: req.user.sub})
    const project = await Project.findOne({_id: id})
    if (owner._id == project.owner) {
      const boards = await Board.find({project: id})
      await new BoardService().recursiveDelete(boards.map(board => board._id))
      const deleteResult = await Project.deleteOne({_id: id})
      res.sendStatus(200)
    } else {
      res.sendStatus(401)
    }

  } catch(error) {
    console.log(error)
    res.send(500)
  }
}

module.exports = { createProject, readProjects, deleteProject }