const { uuid } = require('uuidv4')
const { 
	Assignment,
  Board,
  Comment,
  Group,
  Member,
  Project,
  Space,
  TeamInvite,
  Team,
  User
} = require('../src/app/models/sequelize')

const MongoAssignment = require('../src/app/models/mongo/assignment')
const MongoBoard = require('../src/app/models/mongo/board')
const MongoComment = require('../src/app/models/mongo/comment')
const MongoGroup = require('../src/app/models/mongo/group')
const MongoProject = require('../src/app/models/mongo/project')
const MongoSpace = require('../src/app/models/mongo/space')
const MongoTeamInvite = require('../src/app/models/mongo/team-invite')
const MongoTeam = require('../src/app/models/mongo/team')
const MongoUser = require('../src/app/models/mongo/user')

const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/kanception', {useNewUrlParser: true});

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const migrateAssignments = async () => {
  const mongoAssignments = await MongoAssignment.find()

  for (const mongoAssignment of mongoAssignments) {
    await Assignment.create({
      _id: JSON.stringify(mongoAssignment._id).replace(/\"/g, ''),
      assignee: mongoAssignment.assignee,
      assigner: mongoAssignment.assigner,
      board: mongoAssignment.board,
    })  
  }
}

const migrateBoards = async () => {
  const mongoBoards = await MongoBoard.find()

  for (const mongoBoard of mongoBoards) {
    await Board.create({
      _id: JSON.stringify(mongoBoard._id).replace(/\"/g, ''),
      title: mongoBoard.title,
      description: mongoBoard.description,
      project: mongoBoard.project,
      owner: mongoBoard.owner,
      parent: mongoBoard.parent,
      group: mongoBoard.group,
      order: mongoBoard.order,
      start: mongoBoard.start,
      end: mongoBoard.end,
      count: mongoBoard.count,
      comments: mongoBoard.comments != null ? mongoBoard.comments : false,
    })
  }
}

const migrateComments = async () => {
  const mongoComments = await MongoComment.find()

  for (const mongoComment of mongoComments) {
    await Comment.create({
      _id: JSON.stringify(mongoComment._id).replace(/\"/g, ''),
      owner: mongoComment.owner,
      board: mongoComment.board,
      text: mongoComment.text,
      timestamp: mongoComment.timestamp,
    })
  }
}

const migrateGroups = async () => {
  const mongoGroups = await MongoGroup.find()

  for (const mongoGroup of mongoGroups) {
    await Group.create({
      _id: JSON.stringify(mongoGroup._id).replace(/\"/g, ''),
      title: mongoGroup.title,
      board: mongoGroup.board,
      owner: mongoGroup.owner,
      order: mongoGroup.order,
    })
  }
}

const migrateProjects = async () => {
  const mongoProjects = await MongoProject.find()

  for (const mongoProject of mongoProjects) {
    if (mongoProject.space == null) {
      console.log('NUL')
      console.log({mongoProject})
      continue
    }
    await Project.create({
      _id: JSON.stringify(mongoProject._id).replace(/\"/g, ''),
      title: mongoProject.title,
      space: mongoProject.space,
      owner: mongoProject.owner,
    })
  }
}

const migrateSpaces = async () => {
  const mongoSpaces = await MongoSpace.find()

  for (const mongoSpace of mongoSpaces) {
    await Space.create({
      _id: JSON.stringify(mongoSpace._id).replace(/\"/g, ''),
      title: mongoSpace.title,
      team: mongoSpace.team,
      owner: mongoSpace.owner,
    })
  }
}

const migrateTeamInvites = async () => {
  const mongoTeamInvites = await MongoTeamInvite.find()

  for (const mongoTeamInvite of mongoTeamInvites) {
    await TeamInvite.create({
      _id: JSON.stringify(mongoTeamInvite._id).replace(/\"/g, ''),
      team: mongoTeamInvite.team,
      invitee: mongoTeamInvite.invitee,
    })
  }
}

const migrateTeams = async () => {
  const mongoTeams = await MongoTeam.find()

  for (const mongoTeam of mongoTeams) {
    await Team.create({
      _id: JSON.stringify(mongoTeam._id).replace(/\"/g, ''),
    })
  }
}

const migrateUsers = async () => {
  const mongoUsers = await MongoUser.find()

  for (const mongoUser of mongoUsers) {
    await User.create({
      _id: JSON.stringify(mongoUser._id).replace(/\"/g, ''),
      email: mongoUser.email,
      sub: mongoUser.sub,
      active: mongoUser.active,
      firstName: mongoUser.name.first,
      lastName: mongoUser.name.last,
    })
  }
}

const migrateMembers = async () => {
  const mongoTeams = await MongoTeam.find()

  for (const mongoTeam of mongoTeams) {
    const members = mongoTeam.members

    for (const member of members) {
      await Member.create({
        _id: uuid(),
        team: JSON.stringify(mongoTeam._id).replace(/\"/g, ''),
        user: member,
      })
    }
  }
}

(async () => {
  try {
    await sequelize.sync();

    await migrateAssignments()
    await migrateBoards()
    await migrateComments()
    await migrateGroups()
    await migrateProjects()
    await migrateSpaces()
    await migrateTeamInvites()
    await migrateTeams()
    await migrateUsers()
    await migrateMembers()
  } catch(error) {
    console.log(error)
  }
  console.log('Done!')
  await mongoose.connection.close()
})()