const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Team extends Model {}

	Team.init({
    _id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
	}, {
	  sequelize,
	  modelName: 'Team'
	})

	return Team
}