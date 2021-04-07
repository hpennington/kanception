const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class Space extends Model {}

Space.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
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

module.exports = Space