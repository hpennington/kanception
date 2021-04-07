const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

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
