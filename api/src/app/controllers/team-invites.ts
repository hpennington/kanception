import TeamInviteService from '../services/team-invite-service'
import { resetPassword, sendPasswordResetEmail } from '../util/reset-password'
import { createAuth0User } from '../util/create-auth0-user'
import TeamInviteRepository from '../repositories/mongo/team-invite-repository'
import TeamRepository from '../repositories/mongo/team-repository'
import SpaceRepository from '../repositories/mongo/space-repository'
import UserRepository from '../repositories/mongo/user-repository'

class TeamInviteController {
  private teamInviteService: TeamInviteService

  constructor() {
    const teamInviteRepository = new TeamInviteRepository()
    const teamRepository = new TeamRepository()
    const spaceRepository = new SpaceRepository()
    const userRepository = new UserRepository()
    this.teamInviteService = new TeamInviteService(
      teamInviteRepository,
      teamRepository,
      spaceRepository,
      userRepository
    )

    this.readTeamInvites = this.readTeamInvites.bind(this)
    this.createTeamInvite = this.createTeamInvite.bind(this)
    this.updateTeamInviteAccept = this.updateTeamInviteAccept.bind(this)
    this.deleteInvite = this.deleteInvite.bind(this)
  }

  public async readTeamInvites(req, res) {
    try {
      const sub = req.user.sub

      const teams = await this.teamInviteService.readTeamInvites(sub)

      res.send(teams)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }

  }

  public async createTeamInvite(req, res) {
    const first = req.query.first
    const last = req.query.last
    const email = req.query.email
    const team = req.query.team
    const token = req.headers.authorization

    try {

      const result = await this.teamInviteService.createTeamInvite(first, last, email, team, token)

      if (result === true) {
        res.sendStatus(201)
      } else {
        res.sendStatus(409)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async updateTeamInviteAccept(req, res) {
    try {
      const sub = req.user.sub
      const team = req.query.team
      
      const result = await this.teamInviteService.updateTeamInviteAccept(sub, team)
      res.sendStatus(result)

    } catch(error) {
      console.log(error)
      res.sendStatus(501)
    }
  }

  public async deleteInvite(req, res) {
    try {
      const sub = req.user.sub
      const team = req.query.team
      const result = await this.teamInviteService.deleteInvite(sub, team)

      if (result === true) {
        res.sendStatus(200)  
      } else {
        res.sendStatus(500)  
      }
      
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default TeamInviteController