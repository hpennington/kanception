const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {}

  Project.init({
    _id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    space: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Project'
  })
  
  return Project
}