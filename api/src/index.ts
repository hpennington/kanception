import express = require('express')
import cors = require('cors')
import mongoose = require('mongoose')
import bodyParser = require('body-parser')
import jwt = require('express-jwt')
import jwks = require('jwks-rsa')

const { createComment, readComments } = require('./app/controllers/comments')
const { createAssignment, readAssignments, deleteAssignment } = require('./app/controllers/assignments')
const { createSpace, readSpaces, deleteSpace } = require('./app/controllers/spaces')
const { createProject, readProjects, deleteProject } = require('./app/controllers/projects')
const { readTree } = require('./app/controllers/tree')
const { createUser, readUser, updateName } = require('./app/controllers/user')
const { createTeamInvite, readTeamInvites, updateTeamInviteAccept, deleteInvite } = require('./app/controllers/team-invites')
const { createTeam, readTeam, readTeamRootsChildren, updateTeamBoardAccept } = require('./app/controllers/team')
const { readProfiles } = require('./app/controllers/profiles')
const { createBoard, readTeamBoards, readBoards, updateBoard, updateBoardRefs, deleteBoard } = require('./app/controllers/boards')
const { createGroup, readGroups, updateGroup, deleteGroup } = require('./app/controllers/groups')

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

  app.get('/team/root/children', readTeamRootsChildren)

  app.get('/teaminvites', readTeamInvites)

  app.delete('/teaminvites', deleteInvite)

  app.get('/profiles', readProfiles)

  app.get('/team', readTeam)

  app.post('/team', createTeam)

  app.get('/groups', readGroups)

  app.post('/groups/add', createGroup)

  app.post('/groups/update', updateGroup)

  app.delete('/groups', deleteGroup)

  app.get('/team/boards', readTeamBoards)

  app.delete('/boards', deleteBoard)

  app.post('/board/update', updateBoard)

  app.post('/boards/add', createBoard)

  app.post('/team/board/accept', updateTeamBoardAccept)

  app.listen(port, () => console.log(`API listening at http://localhost:${port}`))
})
