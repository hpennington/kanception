const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

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

  return TeamInvite
}
