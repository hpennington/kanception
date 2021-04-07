const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class Project extends Model {}

Project.init({
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

module.exports = Project