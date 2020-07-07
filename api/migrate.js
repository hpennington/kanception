const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const { v4: uuidv4 } = require('uuid')
const sendmail = require('sendmail')()

const ObjectId = mongoose.Types.ObjectId
const port = 4001
const authConfig = {
  domain: 'kanception.auth0.com',
  audience: 'https://kanception.auth0.com/api/v2/',
}

mongoose.connect('mongodb://mongo/kanception', {useNewUrlParser: true})
const db = mongoose.connection

const spaceSchema = new mongoose.Schema({
  title: String,
  team: String,
  owner: String,
})

const Space = new mongoose.model('Space', spaceSchema)

const projectSchema = mongoose.Schema({
  title: String,
  space: String,
  owner: String,
})

const Project = new mongoose.model('Project', projectSchema)

const boardSchema = new mongoose.Schema({
  title: String,
  project: String,
  owner: String,
  parent: String,
  group: String,
  order: Number,
  groups: [String],
})

const Board = new mongoose.model('Board', boardSchema)

const groupSchema = new mongoose.Schema({
  title: String,
  board: String,
  owner: String,
  order: Number,
})

const Group = new mongoose.model('Group', groupSchema)

const userSchema = new mongoose.Schema({
  email: String,
  sub: String,
  name: {
    first: String,
    last: String,
  },
  spaces: [String],
  active: Boolean,
})

const User = new mongoose.model('User', userSchema)

const teamSchema = new mongoose.Schema({
  members: [String],
})

const Team = new mongoose.model('Team', teamSchema)

const teamInviteSchema = new mongoose.Schema({
  team: String,
  invitee: String,
})

const TeamInvite = new mongoose.model('TeamInvite', teamInviteSchema)

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', async () => {
  try {
    const boards = await Board.find()

    for (const board of boards) {
      console.log(board)
      for (const groupId of board.groups) {
        const group = await Group.findById(new ObjectId(groupId))
        group.board = board._id
        group.save()
      }

      board.groups = undefined
      board.save()
    }

    console.log('FINISHED')

  } catch(error) {
    console.log(error)
  }

})
