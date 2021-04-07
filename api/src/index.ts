import express = require('express')
import cors = require('cors')
import mongoose = require('mongoose')
import bodyParser = require('body-parser')
import jwt = require('express-jwt')
import jwks = require('jwks-rsa')

// Repos
import UserRepository from './app/repositories/sequelize/user-repository'
import AssignmentRepository from './app/repositories/sequelize/assignment-repository'
import BoardRepository from './app/repositories/sequelize/board-repository'
import GroupRepository from './app/repositories/sequelize/group-repository'
import CommentRepository from './app/repositories/sequelize/comment-repository'
import ProjectRepository from './app/repositories/sequelize/project-repository'
import SpaceRepository from './app/repositories/sequelize/space-repository'
import TeamRepository from './app/repositories/sequelize/team-repository'
import TeamInviteRepository from './app/repositories/sequelize/team-invite-repository'

// Services
import BoardService from './app/services/board-service'
import AssignmentService from './app/services/assignment-service'
import CommentService from './app/services/comment-service'
import GroupService from './app/services/group-service'
import ProjectService from './app/services/project-service'
import SpaceService from './app/services/space-service'
import TeamInviteService from './app/services/team-invite-service'
import TeamService from './app/services/team-service'
import UserService from './app/services/user-service'

// Controllers
import BoardController from './app/controllers/boards'
import AssignmentController from './app/controllers/assignments'
import CommentController from './app/controllers/comments'
import GroupController from './app/controllers/groups'
import ProjectController from './app/controllers/projects'
import SpaceController from './app/controllers/spaces'
import UserController from './app/controllers/user'
import TeamController from './app/controllers/team'
import TeamInviteController from './app/controllers/team-invites'

// Init repos 
const userRepository = new UserRepository()
const assignmentRepository = new AssignmentRepository()
const boardRepository = new BoardRepository()
const groupRepository = new GroupRepository()
const commentRepository = new CommentRepository()
const projectRepository = new ProjectRepository()
const spaceRepository = new SpaceRepository()
const teamRepository = new TeamRepository()
const teamInviteRepository = new TeamInviteRepository()

// Init services
const assignmentService = new AssignmentService(
  userRepository,
  assignmentRepository
)

const boardService = new BoardService(
  boardRepository, 
  userRepository, 
  groupRepository, 
  assignmentRepository, 
  commentRepository
)

const commentService = new CommentService(
  userRepository,
  commentRepository,
  boardRepository,
  projectRepository,
  spaceRepository,
  teamRepository,
)

const groupService = new GroupService(
  boardRepository,
  userRepository,
  groupRepository,
  assignmentRepository,
  commentRepository,
  boardService
)

const projectService = new ProjectService(
  boardRepository,
  userRepository,
  groupRepository,
  assignmentRepository,
  commentRepository,
  projectRepository,
  spaceRepository,
  boardService
)

const spaceService = new SpaceService(
  boardRepository,
  userRepository,
  groupRepository,
  assignmentRepository,
  commentRepository,
  teamRepository,
  spaceRepository,
  projectRepository,
  boardService
)

 const teamInviteService = new TeamInviteService(
  teamInviteRepository,
  teamRepository,
  spaceRepository,
  userRepository
)

const teamService = new TeamService(
  boardRepository,
  userRepository,
  groupRepository,
  spaceRepository,
  teamRepository
)

const userService = new UserService(
  userRepository,
  spaceRepository,
  teamRepository
)

// Init controllers
const boardController = new BoardController(boardService)
const assignmentController = new AssignmentController(assignmentService)
const commentController = new CommentController(commentService)
const groupController = new GroupController(groupService)
const projectController = new ProjectController(projectService) 
const spaceController = new SpaceController(spaceService)
const teamInviteController = new TeamInviteController(teamInviteService)
const teamController = new TeamController(teamService)
const userController = new UserController(userService)

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

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/app/config/config.json')[env];

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

(async () => {
  await sequelize.sync();
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
})()
