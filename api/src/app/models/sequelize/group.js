const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class Group extends Model {}

Group.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  board: {
    type: DataTypes.STRING,
    allowNull: false
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Group'
})

module.exports = Group