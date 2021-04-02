import express = require('express')
import cors = require('cors')
import mongoose = require('mongoose')
import bodyParser = require('body-parser')
import jwt = require('express-jwt')
import jwks = require('jwks-rsa')

import BoardController from './app/controllers/boards'
import AssignmentController from './app/controllers/assignments'
import CommentController from './app/controllers/comments'
import GroupController from './app/controllers/groups'
import ProjectController from './app/controllers/projects'
import SpaceController from './app/controllers/spaces'
import UserController from './app/controllers/user'
import TeamController from './app/controllers/team'
import TeamInviteController from './app/controllers/team-invites'

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

const boardController = new BoardController()
const assignmentController = new AssignmentController()
const commentController = new CommentController()
const groupController = new GroupController()
const projectController = new ProjectController()
const spaceController = new SpaceController()
const userController = new UserController()
const teamController = new TeamController()
const teamInviteController = new TeamInviteController()

mongoose.connect('mongodb://mongo/kanception', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {

  app.get('/comments', commentController.readComments)

  app.post('/comments', commentController.createComment)

  app.get('/assignments', assignmentController.readAssignments)

  app.post('/assignment', assignmentController.createAssignment)

  app.delete('/assignment', assignmentController.deleteAssignment)

  app.get('/spaces', spaceController.readSpaces)

  app.delete('/space', spaceController.deleteSpace)

  app.post('/spaces/add', spaceController.createSpace)

  app.delete('/project', projectController.deleteProject)

  app.get('/projects', projectController.readProjects)

  app.post('/projects/add', projectController.createProject)

  app.get('/tree', boardController.readTree)

  app.get('/user', userController.readUser)

  app.post('/user', userController.createUser)

  app.post('/team/invite/accept', teamInviteController.updateTeamInviteAccept)

  app.post('/name', userController.updateName)

  app.post('/team/invite', teamInviteController.createTeamInvite)

  app.get('/team/root/children', teamController.readTeamRootsChildren)

  app.get('/teaminvites', teamInviteController.readTeamInvites)

  app.delete('/teaminvites', teamInviteController.deleteInvite)

  app.get('/profiles', userController.readProfiles)

  app.get('/team', teamController.readTeam)

  app.post('/team', teamController.createTeam)

  app.get('/groups', groupController.readGroups)

  app.post('/groups/add', groupController.createGroup)

  app.post('/groups/update', groupController.updateGroup)

  app.delete('/groups', groupController.deleteGroup)

  app.delete('/boards', boardController.deleteBoard)

  app.post('/board/update', boardController.updateBoard)

  app.post('/boards/add', boardController.createBoard)

  app.listen(port, () => console.log(`API listening at http://localhost:${port}`))
})
