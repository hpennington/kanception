const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class TeamService {

  public async createTeam(sub, title) {
    try {
      const owner = await User.findOne({sub: sub})
      if (owner === null) {
        throw new Error("User is null")
      }

      const team = await Team.create({
        owner: owner._id,
        title: title,
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
        title: title,
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

      return team

    } catch(error) {
      throw error
    }
  }

  public async readTeamRootsChildren(team) {
    try {

      const root = await Board.find({team: team, group: null})

      if (root.length === 0) {
        return null
      }

      return root

      } catch(error) {
        throw error
      }
  }

  public async readTeam(sub, teamId) {
    try {
      const owner = await User.findOne({sub: sub})
      if (owner === null) {
        return null
      }

      const space = await Space.findById({_id: teamId})

      if (owner.spaces.includes(space._id) === false) {
        return null
      }

      const team = await Team.findById(new ObjectId(space.team))

      if (team === null) {
        return null
      }

      return team

    } catch (error) {
      throw error
    }
  }
}

export default TeamService