const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {}

  Assignment.init({
    _id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    assignee: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assigner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    board: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Assignment'
  })
  
  return Assignment
}