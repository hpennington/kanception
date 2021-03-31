const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const { v4: uuidv4 } = require('uuid')
const { createComment, readComments } = require('./app/controllers/comments')
const { createAssignment, readAssignments, deleteAssignment } = require('./app/controllers/assignments')
const { createSpace, readSpaces, deleteSpace } = require('./app/controllers/spaces')
const { createProject, readProjects, deleteProject } = require('./app/controllers/projects')
const { readTree } = require('./app/controllers/tree')
const { createUser, readUser, updateName } = require('./app/controllers/user')
const { createTeamInvite, readTeamInvites, updateTeamInviteAccept, deleteInvite } = require('./app/controllers/team-invites')
const Space = require('./app/models/space')
const Project = require('./app/models/project')
const Board = require('./app/models/board')
const Group = require('./app/models/group')
const User = require('./app/models/user')
const Team = require('./app/models/team')
const TeamInvite = require('./app/models/team-invite')
const Assignment = require('./app/models/assignment')
const Comment = require('./app/models/comment')

const ObjectId = mongoose.Types.ObjectId

const port = 4000

const authConfig = {
  domain: 'kanception.auth0.com',
  audience: 'https://kanception.auth0.com/api/v2/',
}

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
  scope: 'openid profile email',
})

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser())
app.use(express.json())
app.use(jwtCheck)

mongoose.connect('mongodb://mongo/kanception', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {

  app.get('/comments', readComments)

  app.post('/comments', createComment)

  app.get('/assignments', readAssignments)

  app.post('/assignment', createAssignment)

  app.delete('/assignment', deleteAssignment)

  app.get('/spaces', readSpaces)

  app.delete('/space', deleteSpace)

  app.post('/spaces/add', createSpace)

  app.delete('/project', deleteProject)

  app.get('/projects', readProjects)

  app.post('/projects/add', createProject)

  app.get('/tree', readTree)

  app.get('/user', readUser)

  app.post('/user', createUser)

  app.post('/team/invite/accept', updateTeamInviteAccept)

  app.post('/name', updateName)

  app.post('/team/invite', createTeamInvite)

  const resetPassword = async (user_id, email) => {
    console.log({email})
    console.log({user_id})
	  const tokenResult = await fetch(
      'https://kanception.auth0.com/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        "client_id": "",
        "client_secret": "",
        "audience": "https://kanception.auth0.com/api/v2/",
        "grant_type": "client_credentials"
      })
	  })

    const accessToken = await tokenResult.json()
    const token = accessToken.access_token

    const resetPasswordResult =
      await fetch('https://kanception.auth0.com/api/v2/tickets/password-change?email=' + email, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user_id,
      }),
	  })

    console.log('sent reset password email')
    const resetPassword = await resetPasswordResult.json()
    console.log({resetPassword})

    sendPasswordResetEmail(email, resetPassword.ticket)
  }

  const createAuth0User = async (email, first, last) => {
	  const tokenResult = await fetch(
      'https://kanception.auth0.com/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        "client_id": "",
        "client_secret": "",
        "audience": "https://kanception.auth0.com/api/v2/",
        "grant_type": "client_credentials"
      })
	  })

    const accessToken = await tokenResult.json()
    const token = accessToken.access_token

    const auth0UserResult = await fetch('https://kanception.auth0.com/api/v2/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        connection: 'Username-Password-Authentication',
        email: email,
        email_verified: true,
        given_name: first,
        family_name: last,
        password: uuidv4()
      }),
	  })
    console.log(auth0UserResult)
    const auth0User = await auth0UserResult.json()
    console.log(auth0User)

    return auth0User
  }

  app.get('/team/root/children', async (req, res) => {
    const team = req.query.team

    try {

      const root = await Board.find({team: team, group: null})

      if (root.length === 0) {
        res.sendStatus(500)
        return
      }

      res.send(root)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/teaminvites', readTeamInvites)

  app.delete('/teaminvites', deleteInvite)

  app.get('/profiles', async (req, res) => {
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
  })

  app.get('/team', async (req, res) => {
    try {
      const owner = await User.findOne({sub: req.user.sub})
      if (owner === null) {
        res.sendStatus(500)
        return
      }

      const space = await Space.findById({_id: req.query.team})
      console.log(space)

      if (owner.spaces.includes(space._id) === false) {
        res.sendStatus(501)
        return
      }

      const team = await Team.findById(new ObjectId(space.team))

      if (team === null) {
        res.sendStatus(502)
        return
      }

      res.send(JSON.stringify(team))

    } catch (error) {
      console.log(error)
      res.sendStatus(503)
    }
  })

  app.post('/team', async (req, res) => {
    try {
      const owner = await User.findOne({sub: req.user.sub})
      if (owner === null) {
        res.sendStatus(500)
      }

      const team = await Team.create({
        owner: owner._id,
        title: req.query.title,
        members: [owner._id]
      })

      owner.spaces.push(team._id)
      owner.save()

      const groupBacklog = await Group.create({title: "Backlog", owner: team._id, order: 0})
      const groupTodo = await Group.create({title: "To-do", owner: team._id, order: 1})
      const groupInProgress = await Group.create({title: "In progress", owner: team._id, order: 2})
      const groupReview = await Group.create({title: "Review", owner: team._id, order: 3})
      const groupDone = await Group.create({title: "Done", owner: team._id, order: 4})

      const groups = [groupBacklog, groupTodo, groupInProgress, groupReview, groupDone]

      const teamRoot = await Board.create({
        title: req.query.title,
        owner: team._id,
        groups: groups.map(group => group._id),
        order: 0,
        parent: null,
        team: team._id,
        group: null,
        isTeamRoot: true,
        isUserRoot: false,
        count: 0,
        comments: false,
      })

      res.send(team)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/groups', async (req, res) => {
    try {
      const boardId = req.query.board_id
      const groups = await Group.find({board: boardId})
      res.send(groups)
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.post('/groups/add', async (req, res) => {
    try {
      const boardId = req.query.board
      const ownerObject = await User.findOne({sub: req.user.sub})
      const owner = ownerObject._id
      const board = await Board.findById(new ObjectId(boardId))
      const currentGroups = await Group.find({board: boardId})
      const order = Math.max(...[-1, ...currentGroups.map(group => group.order)]) + 1
      const group = await Group.create({owner: owner, title: '', order: order, board: boardId})

      res.send(group)
    } catch(error) {
      console.log(error)
    }
  })

  app.post('/groups/update', async (req, res) => {

    try {
      const groupId = req.query.id
      const group = await Group.findById(new ObjectId(groupId))
      const updatedGroup = Object.assign(group, req.body)
      updatedGroup.save()
      res.sendStatus(201)

    } catch(error) {
      res.sendStatus(500)
    }

  })

  app.delete('/groups', async (req, res) => {
    const id = req.query.id

    try {

      const user = await User.findOne({sub: req.user.sub})
      const group = await Group.findById(new ObjectId(id))

      if (group.owner == user._id) {
        const deleteResult = await Group.deleteOne({_id: id})
        const boards = await Board.find({group: id})
        if (boards.length > 0) {
          await recursiveDelete(boards.map(board => board._id))
        }
        res.sendStatus(201)
      } else {
        res.sendStatus(403)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/team/boards', async (req, res) => {
    const ids = req.query.ids

    const boards = []

    if (ids != null) {
      for (const id of ids) {
        const boardRef = await BoardRef.find({board: id})
        const board = await Board.findById(new ObjectId(id))

        boards.push({
          groups: board.groups,
          _id: board._id,
          title: board.title,
          owner: board.owner,
          order: board.order,
          group: boardRef[0].group,
          count: board.count,
        })
      }
    }

    res.send(boards)
  })

  app.get('/boards', async (req, res) => {
    const ids = req.query.ids

    const boards = []

    if (ids != null) {
      const user = await User.find({sub: req.user.sub})
      for (const id of ids) {
        const boardRef = await BoardRef.find({board: id, owner: user[0]._id})
        const board = await Board.findById(new ObjectId(id))

        // Add assignees to board
        const assigments = await Assignment.find({board: id})
        const assignees = assignments.map(assignment => assignment.assignee)

        boards.push({
          groups: board.groups,
          _id: board._id,
          title: board.title,
          description: board.description,
          owner: board.owner,
          order: board.order,
          group: boardRef[0].group,
          count: board.count,
          assignees: assignees,

        })
      }
    }

    res.send(boards)
  })

  app.delete('/boards', async (req, res) => {
    const id = req.query.id

    try {

      const user = await User.findOne({sub: req.user.sub})
      const board = await Board.findById(new ObjectId(id))

      console.log(board.owner)
      console.log(user._id)
      if (board.owner == user._id) {
        if (board.parent !== null) {
          await recursiveUpdateCount(board.parent, -1)
        }

        await recursiveDelete([id])

        res.sendStatus(201)
      } else {
        res.sendStatus(403)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  const recursiveDelete = async ids => {
    for (const id of ids) {
      const deleteAssignementsResult = await Assignment.deleteMany({board: id})
      const deleteCommentsResult = await Comment.deleteMany({board: id})
      const deleteResult = await Board.deleteOne({_id: new ObjectId(id)})
      const children = await Board.find({parent: id})
      const childrenIds = children.map(child => child._id)
      if (childrenIds.length > 0) {
        recursiveDelete(childrenIds)
      } else {
        return
      }
    }
  }

  app.post('/board/update', async (req, res) => {

    try {
      const boardId = req.query.id
      const board = await Board.findById(new ObjectId(boardId))
      const updatedBoard = Object.assign(board, req.body)
      console.log('updatedboard: ' + board)
      updatedBoard.save()
      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }

  })

  app.post('/boardrefs/update', async (req, res) => {

    try {
      const boardId = req.query.id
      const user = await User.find({sub: req.user.sub})
      const board = await BoardRef.find({board: boardId, owner: user[0]._id})
      const updatedBoard = Object.assign(board[0], req.body)
      updatedBoard.save()
      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }

  })

  app.post('/boards/add', async (req, res) => {
    try {

      const project = req.query.project
      const group = req.query.group
      const parent = req.query.parent

      const owner = await User.findOne({sub: req.user.sub})

      const boards = await Board.find({group: group})
      const order = Math.max(...[-1, ...boards.map(board => board.order)]) + 1

      const board = await Board.create({
        title: "",
        description: "",
        owner: owner._id,
        order: order,
        project: project,
        parent: parent,
        group: group,
        count: 0,
        comments: false,
      })

      const groupBacklog = await Group.create({
        title: "Backlog",
        owner: owner._id,
        order: 0,
        board: board._id,
      })

      const groupTodo = await Group.create({
        title: "To-do",
        owner: owner._id,
        order: 1,
        board: board._id,
      })

      const groupInProgress = await Group.create({
        title: "In progress",
        owner: owner._id,
        order: 2,
        board: board._id,
      })

      const groupReview = await Group.create({
        title: "Review",
        owner: owner._id,
        order: 3,
        board: board._id,
      })

      const groupDone = await Group.create({
        title: "Done",
        owner: owner._id,
        order: 4,
        board: board._id,
      })

      const groups = [
        groupBacklog,
        groupTodo,
        groupInProgress,
        groupReview,
        groupDone
      ]

      await recursiveUpdateCount(parent, 1)

      res.send(board)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  const recursiveUpdateCount = async (id, amount) => {
    try {

      let currentId = id
      do {

        const board = await Board.findById(new ObjectId(currentId))
        await board.update({$inc: {count: amount}})
        board.save()
        console.log({board})

        currentId = board.parent

       } while(currentId !== null)

    } catch(error) {
      console.log(error)
      throw error
    }
  }

  app.post('/team/board/accept', async (req, res) => {
    const board = req.query.board
    const parent = req.query.parent
    const team = req.query.team
    const group = req.query.group

    try {

      const user = await User.find({sub: req.user.sub})

      if (user.length === 0) {
        res.sendStatus(500)
        return
      }

      const checkBoardRefExists = await BoardRef.find({board: board, owner: user[0]._id})
      if (checkBoardRefExists.length > 0) {
        res.sendStatus(409)
        return
      }

      const boardRef = await BoardRef.create({
        board: board,
        owner: user[0]._id,
        parent: parent,
        team: team,
        group: group,
        isUserRoot: false,
        isTeamRoot: false,
      })

      res.send(boardRef)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
})
