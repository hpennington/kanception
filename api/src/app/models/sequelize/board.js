const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

class Board extends Model {}

Board.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project: {
    type: DataTypes.STRING,
    allowNull: false
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  end: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comments: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  sequelize,

  modelName: 'Board'
})

Board.assignees = []

module.exports = Board