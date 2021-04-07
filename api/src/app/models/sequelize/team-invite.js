const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

class TeamInvite extends Model {}

TeamInvite.init({
  team: {
    type: DataTypes.STRING,
    allowNull: false
  },
  invitee: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'TeamInvite'
})

module.exports = TeamInvite
