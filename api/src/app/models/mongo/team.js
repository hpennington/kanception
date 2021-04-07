const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  members: [String],
})

const Team = new mongoose.model('Team', teamSchema)

module.exports = Team