const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

class Team extends Model {}

Team.init({
}, {
  sequelize,
  modelName: 'Team'
})

module.exports = Team