import { resetPassword, sendPasswordResetEmail } from '../util/reset-password'
import { createAuth0User } from '../util/create-auth0-user'
const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const TeamInvite = require('../models/team-invite')
const Assignment = require('../models/assignment')
const Comment = require('../models/comment')
const fetch = require('node-fetch')
const aws = require('aws-sdk')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class TeamInviteService {

  public async readTeamInvites(sub) {
    try {
      const user = await User.find({sub: sub})
      const invites = await TeamInvite.find({invitee: user[0]._id})

      const returnResult = []
      for (const invite of invites) {
        const spaceResult = await Space.findById(new ObjectId(invite.team))
        const result = await Team.findById(new ObjectId(spaceResult.team))
        returnResult.push(result)
      }

      return returnResult

    } catch(error) {
      throw error
    }

  }

  public async createTeamInvite(first, last, email, team, token) {

    try {
      const user = await User.findOne({email: email})
      const spaceRecord = await Space.findById(new ObjectId(team))
      const teamRecord = await Team.findById(new ObjectId(spaceRecord.team))

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
          const invitation = await TeamInvite.findOne({invitee: user._id})
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
            const invite = await TeamInvite.create({
              team: team,
              invitee: user._id
            })

            // Create auth0 user
            const auth0User = await createAuth0User(email, first, last)

            // Send invite email
            await resetPassword(auth0User.user_id, auth0User.email)
            return true
          }

        }


      // Else the user does not exist
      } else {
        const invitedUser = await User.create(
          {name: {
            first: first,
            last: last
          }, email: email,
            active: false,
            spaces: []
        })

        const invite = await TeamInvite.create({
          team: team,
          invitee: invitedUser._id
        })

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

      const user = await User.find({sub: sub})
      if (user.length === 0) {
        return 504
      }

      console.log(team)
      const space = await Space.findOne({team: team})

      const teamInvite = await TeamInvite
        .find({team: space._id, invitee: user[0]._id})

      if (teamInvite.length === 0) {
        return 503
      }

      user[0].spaces.push(space._id)
      user[0].save()

      const teamResult = await Team.findById(new ObjectId(team))

      if (teamResult === null || teamResult === undefined) {
        return 503
      }

      teamResult.members.push(user[0]._id)
      teamResult.save()

      const result = await TeamInvite
        .deleteOne({invitee: user[0]._id, team: space._id})

      return 201

    } catch(error) {
      return 501
    }
  }

  public async deleteInvite(sub, team) {
    try {
      const user = await User.find({sub: sub})

      if (user.length === 0) {
        throw new Error('User does not exist')
      }

      const space = await Space.findOne({team: team})
      const result = await TeamInvite
        .deleteOne({invitee: user[0]._id, team: space._id})

      return true

    } catch(error) {
      throw error
    }
  }
}

export default TeamInviteService