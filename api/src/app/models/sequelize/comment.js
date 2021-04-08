const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {}

  Comment.init({
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    board: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Comment'
  })

  return Comment
}