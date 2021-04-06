import { resetPassword, sendPasswordResetEmail } from '../util/reset-password'
import { createAuth0User } from '../util/create-auth0-user'
import TeamInviteRepositoryInterface from '../repositories/team-invite-repository-interface'
import TeamRepositoryInterface from '../repositories/team-repository-interface'
import SpaceRepositoryInterface from '../repositories/space-repository-interface'
import UserRepositoryInterface from '../repositories/user-repository-interface'

class TeamInviteService {
  private teamInviteRepository: TeamInviteRepositoryInterface
  private teamRepository: TeamRepositoryInterface
  private spaceRepository: SpaceRepositoryInterface
  private userRepository: UserRepositoryInterface

  constructor(
    teamInviteRepository: TeamInviteRepositoryInterface,
    teamRepository: TeamRepositoryInterface,
    spaceRepository: SpaceRepositoryInterface,
    userRepository: UserRepositoryInterface
  ) {
    this.teamInviteRepository = teamInviteRepository
    this.teamRepository = teamRepository
    this.spaceRepository = spaceRepository
    this.userRepository = userRepository
  }

  public async readTeamInvites(sub) {
    try {
      const user = await this.userRepository.findOne({sub: sub})
      const invites = await this.teamInviteRepository.findAll({invitee: user._id})

      const returnResult = []
      for (const invite of invites) {
        const spaceResult = await this.spaceRepository.find(invite.team)
        const result = await this.teamRepository.find(spaceResult.team)
        returnResult.push(result)
      }

      return returnResult

    } catch(error) {
      throw error
    }

  }

  public async createTeamInvite(first, last, email, team, token) {

    try {
      const user = await this.userRepository.findOne({email: email})
      const spaceRecord = await this.spaceRepository.find(team)
      const teamRecord = await this.teamRepository.find(spaceRecord.team)

      if (teamRecord === null || teamRecord === undefined) {
        console.log('teamRecord is null')
        throw new Error('team does not exist')
      }

      // If the user exists
      if (user != null) {

        // Check if user is already a member.

        if (teamRecord.members.includes(user._id) === true) {
          return false

          // Else user is not a member
        } else {

          // Check if invitation already exists
          const invitation = await this.teamInviteRepository.findOne({invitee: user._id})
          if (invitation !== null && invitation !== undefined) {
            // Create auth0 user
            const auth0User = await createAuth0User(email, first, last)
      
            if (auth0User.status !== 200) {
              const userInfo = await fetch('https://kanception.auth0.com/userinfo', {
                headers: {
                  Authorization: token,
                }
              })

              const info = await userInfo.json()
   
              await resetPassword(info.sub, email)
              return true
            } else {
              // Send password reset email

              await resetPassword(auth0User.user_id, email)
              return true
            }

          // Else invitation doesn't exist
          } else {

            // Create invitaion
            const invite = await this.teamInviteRepository.create(team, user._id)

            // Create auth0 user
            const auth0User = await createAuth0User(email, first, last)

            // Send invite email
            await resetPassword(auth0User.user_id, auth0User.email)
            return true
          }

        }


      // Else the user does not exist
      } else {

        const invitedUser = await this.userRepository.create(first, last, email, false, [])
        const invite = await this.teamInviteRepository.create(team, invitedUser._id)

        const auth0User = await createAuth0User(email, first, last)
        if (auth0User.status !== 200) {

          const userInfo = await fetch('https://kanception.auth0.com/userinfo', {
            headers: {
              Authorization: token,
            }
          })

          const info = await userInfo.json()

          await resetPassword(info.sub, email)
          return true
        } else {
          await resetPassword(auth0User.user_id, auth0User.email)
          return true
        }

      }

    } catch(error) {
      throw error
    }
  }

  public async updateTeamInviteAccept(sub, team) {
    try {

      const user = await this.userRepository.findOne({sub: sub})
      if (user === null) {
        return 504
      }

      const space = await this.spaceRepository.findOne({team: team})

      const teamInvite = await this.teamInviteRepository
        .findAll({team: space._id, invitee: user._id})

      if (teamInvite.length === 0) {
        return 503
      }

      user.spaces.push(space._id)
      user.save()

      const teamResult = await this.teamRepository.find(team)

      if (teamResult === null || teamResult === undefined) {
        return 503
      }

      teamResult.members.push(user._id)
      teamResult.save()

      const result = await this.teamInviteRepository
        .deleteOne({invitee: user._id, team: space._id})

      return 201

    } catch(error) {
      return 501
    }
  }

  public async deleteInvite(sub, team) {
    try {
      const user = await this.userRepository.findOne({sub: sub})

      if (user === null) {
        throw new Error('User does not exist')
      }

      const space = await this.spaceRepository.findOne({team: team})
      const result = await this.teamInviteRepository
        .deleteOne({invitee: user._id, team: space._id})

      return true

    } catch(error) {
      throw error
    }
  }
}

export default TeamInviteService