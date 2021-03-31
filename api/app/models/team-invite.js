const mongoose = require('mongoose')

const teamInviteSchema = new mongoose.Schema({
  team: String,
  invitee: String,
})

const TeamInvite = new mongoose.model('TeamInvite', teamInviteSchema)

module.exports = TeamInvite