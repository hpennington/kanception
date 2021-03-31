const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const createSpace = async (req, res) => {
  try {

    const title = req.query.title
    const owner = await User.findOne({sub: req.user.sub})
    const team = await Team.create({members: [owner._id]})
    const space = await Space.create({title: title, team: team._id, owner: owner._id})

    owner.spaces.push(space._id)
    owner.save()

    res.send(space)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const readSpaces = async (req, res) => {
	try {

	  const owner = await User.findOne({sub: req.user.sub})

	  const spaces = []

	  for (const spaceId of owner.spaces) {
	    console.log('spaceid: ' + spaceId)
	    const space = await Space.findById(new ObjectId(spaceId))
	    console.log(space)
	    spaces.push(space)
	  }

	  res.send(spaces)

	} catch(error) {
	  console.log(error)
	  res.sendStatus(500)
	}
}

const deleteSpace = async (req, res) => {
  const id = req.query.id
  try {

    const user = await User.findOne({sub: req.user.sub})
    const space = await Space.findById(new ObjectId(id))
    const team = await Team.findById(new ObjectId(space.team))

    if (user._id != space.owner) {
      res.sendStatus(401)
      return
    }

    const projects = await Project.find({space: id})

    for (const project of projects) {

      const boards = await Board.find({project: project._id})

      await recursiveDelete(boards.map(board => board._id))

      const result = await Project.deleteOne({_id: project._id})
    }

    for (const member of team.members) {
      const teamMember = await User.findById(new ObjectId(member))
      teamMember.spaces = teamMember.spaces.filter(s => s !== id)
      teamMember.save()
    }

    const result = await Space.deleteOne({_id: id})
    const result2 = await Team.deleteOne({_id: space.team})

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { createSpace, readSpaces, deleteSpace }