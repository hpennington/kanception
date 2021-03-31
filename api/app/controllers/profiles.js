const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const readProfiles = async (req, res) => {
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

module.exports = { readProfiles }