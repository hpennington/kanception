const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Member extends Model {}

  Member.init({
    _id: {
      allowNull: false,
      type: DataTypes.STRING,
      autoIncrement: false,
      primaryKey: true,
    },
    team:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    user:{
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Member',
  })

  return Member
}