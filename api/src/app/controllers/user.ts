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

class UserController {
  public async createUser(req, res) {
    console.log(req.user)
    const user = await User.find({sub: req.user.sub})
    const token = req.headers.authorization

    const userEmail = await fetch('https://kanception.auth0.com/userinfo', {
      headers: {
        Authorization: token,
      }
    })
    const email = await userEmail.json()

    console.log(email)
    const userFromEmail = await User.find({email: email.email})

    if (user.length === 0 && userFromEmail.length === 0) {

      const user = await User.create({sub: req.user.sub, spaces: [], active: true})

      res.send(user)
    } else if (user.length === 0 && userFromEmail.length > 0) {
      userFromEmail[0].sub = req.user.sub
      userFromEmail[0].active = true
      userFromEmail[0].save()

      res.send(userFromEmail[0])

    } else {
      res.send(user[0])
    }

  }

  public async readUser(req, res) {
    try {
      const user = await User.findOne({sub: req.user.sub})
      res.send(user.spaces)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async readProfiles(req, res) {
    const team = req.query.team
    try {

      const user = await User.find({sub: req.user.sub})
      if (user.length === 0) {
        res.sendStatus(503)
        return
      }

      const spaceResult = await Space.findById(new ObjectId(team))
      const teamResult = await Team.findById(new ObjectId(spaceResult.team))
      if (teamResult === undefined || teamResult === null) {
        res.sendStatus(502)
        return
      }

      if (teamResult.members.includes(user[0]._id) === false) {
        console.log('members')
        console.log(teamResult.members)
        console.log(user[0]._id)
        res.sendStatus(501)
        return
      }

      const profiles = []

      for (const member of teamResult.members) {
        console.log(member)
        const userObject = await User.findById(new ObjectId(member))

        if (userObject === null || userObject === undefined) {
          res.sendStatus(500)
          return
        }

        profiles.push({
          _id: userObject._id,
          email: userObject.email,
          name: userObject.name,
        })
      }

      res.send(JSON.stringify(profiles))

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async updateName(req, res) {
    try {

      const users = await User.find({sub: req.user.sub})
      const user = users[0]
      const first = req.query.first
      const last = req.query.last
      const token = req.headers.authorization

      const userEmail = await fetch('https://kanception.auth0.com/userinfo', {
        headers: {
          Authorization: token,
        }
      })

      const email = await userEmail.json()
      console.log(email.email)

      user.name = {
        first: first,
        last: last,
      }


      user.email = email.email

      user.save()

      console.log(user)

      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default UserController