const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {}

  Board.init({
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
      allowNull: true
    },
    group: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    end: {
      type: DataTypes.INTEGER,
      allowNull: true
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

  return Board
}