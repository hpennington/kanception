const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Team extends Model {}

	Team.init({
	  _id: {
	    type: DataTypes.STRING,
	    primaryKey: true
	  },
	}, {
	  sequelize,
	  modelName: 'Team'
	})

	return Team
}