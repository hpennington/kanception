const mongoose = require('mongoose')

const spaceSchema = new mongoose.Schema({
  title: String,
  team: String,
  owner: String,
})

const Space = new mongoose.model('Space', spaceSchema)

module.exports = Space