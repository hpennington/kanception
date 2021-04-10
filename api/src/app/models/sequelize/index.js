'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const Assignment = require('./assignment')(sequelize, Sequelize.DataTypes)
const Board = require('./board')(sequelize, Sequelize.DataTypes)
const Comment = require('./comment')(sequelize, Sequelize.DataTypes)
const Group = require('./group')(sequelize, Sequelize.DataTypes)
const Member = require('./member')(sequelize, Sequelize.DataTypes)
const Project = require('./project')(sequelize, Sequelize.DataTypes)
const Space = require('./space')(sequelize, Sequelize.DataTypes)
const TeamInvite = require('./team-invite')(sequelize, Sequelize.DataTypes)
const Team = require('./team')(sequelize, Sequelize.DataTypes)
const User = require('./user')(sequelize, Sequelize.DataTypes)

db['Assignment'] = Assignment
db['Board'] = Board
db['Comment'] = Comment
db['Group'] = Group
db['Member'] = Member
db['Project'] = Project
db['Space'] = Space
db['TeamInvite'] = TeamInvite
db['Team'] = Team
db['User'] = User

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
