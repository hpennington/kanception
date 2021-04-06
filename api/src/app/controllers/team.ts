import TeamService from '../services/team-service'
import BoardRepository from '../repositories/mongo/board-repository'
import UserRepository from '../repositories/mongo/user-repository'
import GroupRepository from '../repositories/mongo/group-repository'
import SpaceRepository from '../repositories/mongo/space-repository'
import TeamRepository from '../repositories/mongo/team-repository'

class TeamController {
  private teamService: TeamService

  constructor() {
    const boardRepository = new BoardRepository()
    const userRepository = new UserRepository()
    const groupRepository = new GroupRepository()
    const spaceRepository = new SpaceRepository()
    const teamRepository = new TeamRepository()


    this.teamService = new TeamService(
      boardRepository,
      userRepository,
      groupRepository,
      spaceRepository,
      teamRepository
    )

    this.createTeam = this.createTeam.bind(this)
    this.readTeamRootsChildren = this.readTeamRootsChildren.bind(this)
    this.readTeam = this.readTeam.bind(this)
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