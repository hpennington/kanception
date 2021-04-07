const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

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

module.exports = Assignment