const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Space extends Model {}

  Space.init({
    _id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    team: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Space'
  })

  return Space
}