const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

export default class Assignment extends Model {}

Assignment.init({
  assignee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assigner: {
    type: DataTypes.STRING
    allowNull: false
  },
  board: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Assignment'
});