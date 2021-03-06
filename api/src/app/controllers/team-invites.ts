import TeamInviteService from '../services/team-invite-service'

class TeamInviteController {
  private teamInviteService: TeamInviteService

  constructor(teamInviteService: TeamInviteService) {
    this.teamInviteService = teamInviteService

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