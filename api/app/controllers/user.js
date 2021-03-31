const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const TeamInvite = require('../models/team-invite')
const Assignment = require('../models/assignment')
const Comment = require('../models/comment')

const createUser = async (req, res) => {
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

const readUser = async (req, res) => {
  try {
    const user = await User.findOne({sub: req.user.sub})
    res.send(user.spaces)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const updateName = async (req, res) => {
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

module.exports = { createUser, readUser, updateName }