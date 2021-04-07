const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

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