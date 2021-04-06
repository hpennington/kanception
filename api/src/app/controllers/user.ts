import UserService from '../services/user-service'
import UserRepository from '../repositories/mongo/user-repository'
import SpaceRepository from '../repositories/mongo/space-repository'
import TeamRepository from '../repositories/mongo/team-repository'

class UserController {
  private userService: UserService

  constructor() {
    const userRepository = new UserRepository()
    const spaceRepository = new SpaceRepository()
    const teamRepository = new TeamRepository()
    this.userService = new UserService(
      userRepository,
      spaceRepository,
      teamRepository
    )

    this.createUser = this.createUser.bind(this)
    this.readUser = this.readUser.bind(this)
    this.readProfiles = this.readProfiles.bind(this)
    this.updateName = this.updateName.bind(this)
  }

  public async createUser(req, res) {
    const sub = req.user.sub
    const token = req.headers.authorization

    const user = await this.userService.createUser(sub, token)
    res.send(user)

  }

  public async readUser(req, res) {
    try {
      const sub = req.user.sub
      const spaces = await this.userService.readUser(sub)
      res.send(spaces)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async readProfiles(req, res) {
    const sub = req.user.sub
    const team = req.query.team
    try {
      
      const profiles = await this.userService.readProfiles(sub, team)
      if (profiles !== null) {
        res.send(JSON.stringify(profiles))  
      } else {
        res.sendStatus(500)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async updateName(req, res) {
    try {

      const sub = req.user.sub
      const first = req.query.first
      const last = req.query.last
      const token = req.headers.authorization

      const user = await this.userService.updateName(sub, first, last, token)

      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default UserController