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
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class UserService {
  public async createUser(sub, token) {
    const user = await User.find({sub: sub})

    const userEmail = await fetch('https://kanception.auth0.com/userinfo', {
      headers: {
        Authorization: token,
      }
    })
    const email = await userEmail.json()

    const userFromEmail = await User.find({email: email.email})

    if (user.length === 0 && userFromEmail.length === 0) {

      const user = await User.create({sub: sub, spaces: [], active: true})

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
      const user = await User.findOne({sub: sub})
      return user.spaces
    } catch (error) {
      throw error
    }
  }

  public async readProfiles(sub, team) {
    try {

      const user = await User.find({sub: sub})
      if (user.length === 0) {
        // res.sendStatus(503)
        return null
      }

      const spaceResult = await Space.findById(new ObjectId(team))
      const teamResult = await Team.findById(new ObjectId(spaceResult.team))
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
        const userObject = await User.findById(new ObjectId(member))

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

      const users = await User.find({sub: sub})
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