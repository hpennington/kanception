const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

  class TeamInvite extends Model {}

  TeamInvite.init({
    _id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    team: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invitee: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'TeamInvite'
  })

  return TeamInvite
}
