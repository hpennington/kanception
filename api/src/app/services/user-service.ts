const fetch = require('node-fetch')
import { uuid } from 'uuidv4'
import UserRepositoryInterface from '../repositories/user-repository-interface'
import SpaceRepositoryInterface from '../repositories/space-repository-interface'
import TeamRepositoryInterface from '../repositories/team-repository-interface'

class UserService {
  private userRepository: UserRepositoryInterface
  private spaceRepository: SpaceRepositoryInterface
  private teamRepository: TeamRepositoryInterface
  
  constructor(
    userRepository: UserRepositoryInterface,
    spaceRepository: SpaceRepositoryInterface,
    teamRepository: TeamRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.spaceRepository = spaceRepository
    this.teamRepository = teamRepository
  }

  public async createUser(sub, token) {
    const user = await this.userRepository.findAll({sub: sub})

    const userEmail = await fetch('https://kanception.auth0.com/userinfo', {
      headers: {
        Authorization: token,
      }
    })
    const email = await userEmail.json()

    const userFromEmail = await this.userRepository.findAll({email: email.email})

    if (user.length === 0 && userFromEmail.length === 0) {

      const user = await this.userRepository.create({_id: uuid(), sub: sub, spaces: [], active: true})

      return user

    } else if (user.length === 0 && userFromEmail.length > 0) {
      userFromEmail[0].sub = sub
      userFromEmail[0].active = true
      userFromEmail[0].save()

      return userFromEmail[0]

    } else {
      return user[0]
    }

  }

  public async readUser(sub) {
    try {
      const user = await this.userRepository.findOne({sub: sub})
      return user.spaces
    } catch (error) {
      throw error
    }
  }

  public async readProfiles(sub, team) {
    try {

      const user = await this.userRepository.findAll({sub: sub})
      if (user.length === 0) {
        // res.sendStatus(503)
        return null
      }

      const spaceResult = await this.spaceRepository.find(team)
      const teamResult = await this.teamRepository.find(spaceResult.team)
      if (teamResult === undefined || teamResult === null) {
        // res.sendStatus(502)
        return null
      }

      if (teamResult.members.includes(user[0]._id) === false) {
        // res.sendStatus(501)
        return null
      }

      const profiles = []

      for (const member of teamResult.members) {
        const userObject = await this.userRepository.find(member)

        if (userObject === null || userObject === undefined) {
          // res.sendStatus(500)
          return null
        }

        profiles.push({
          _id: userObject._id,
          email: userObject.email,
          name: userObject.name,
        })
      }

      return profiles
      // res.send(JSON.stringify(profiles))

    } catch(error) {
      throw error
    }
  }

  public async updateName(sub, first, last, token) {
    try {

      const users = await this.userRepository.findAll({sub: sub})
      const user = users[0]

      const userEmail = await fetch('https://kanception.auth0.com/userinfo', {
        headers: {
          Authorization: token,
        }
      })

      const email = await userEmail.json()

      user.name = {
        first: first,
        last: last,
      }

      user.email = email.email

      user.save()

      return user

    } catch(error) {
      throw error
    }
  }
}

export default UserService