const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {}

  Assignment.init({
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