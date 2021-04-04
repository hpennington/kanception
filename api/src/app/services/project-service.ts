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

class ProjectService {
  public async createProject(sub, title, space) {
    try {
      const owner = await User.findOne({sub: sub})
      const project = await Project.create({
        title: title,
        space: space,
        owner: owner._id,
      })

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

      return project

    } catch(error) {
      throw error
    }
  }

  public async readProjects(sub) {
    try {

      const owner = await User.findOne({sub: sub})

      const projects = []

      for (const team of owner.spaces) {
        console.log(team)
        const space = await Space.findById(new ObjectId(team))
        console.log(space)
        const projectsResult = await Project.find({space: space._id})
        projects.push(...projectsResult)
      }

      return projects

    } catch(error) {
      throw error
    }
  }

  public async deleteProject(sub, id) {
    try {
    
      const owner = await User.findOne({sub: sub})
      const project = await Project.findOne({_id: id})
      if (owner._id == project.owner) {
        const boards = await Board.find({project: id})
        await new BoardService().recursiveDelete(boards.map(board => board._id))
        const deleteResult = await Project.deleteOne({_id: id})
        return true
      } else {
        return false
      }

    } catch(error) {
      throw error
    }
  }
}

export default ProjectService