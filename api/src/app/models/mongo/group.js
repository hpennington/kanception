const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  title: String,
  board: String,
  owner: String,
  order: Number,
})

const Group = new mongoose.model('Group', groupSchema)

module.exports = Group