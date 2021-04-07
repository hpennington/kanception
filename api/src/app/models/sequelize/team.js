const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class Team extends Model {}

Team.init({
}, {
  sequelize,
  modelName: 'Team'
})

module.exports = Team