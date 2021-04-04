const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
import TeamService from '../services/team-service'

class TeamController {
  private teamService: TeamService

  constructor() {
    this.teamService = new TeamService()
  }

  public async createTeam(req, res) {
    try {
      const sub = req.user.sub
      const title = req.query.title
      const team = await this.teamService.createTeam(sub, title)
      res.send(team)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async readTeamRootsChildren(req, res) {
    const team = req.query.team

    try {

      const root = await this.teamService.readTeamRootsChildren(team)

      if (root !== null) {
        res.send(root)  
      } else {
        res.sendStatus(500)
      }

      } catch(error) {
        console.log(error)
        res.sendStatus(500)
      }
  }

  public async readTeam(req, res) {
    try {
      const sub = req.user.sub
      const teamId = req.query.team
      const team = await this.teamService.readTeam(sub, teamId)
      if (team !== null) {
        res.send(JSON.stringify(team))
      } else {
        res.sendStatus(500)
      }

    } catch (error) {
      console.log(error)
      res.sendStatus(503)
    }
  }
}

export default TeamController