const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  project: String,
  owner: String,
  parent: String,
  group: String,
  order: Number,
  start: Number,
  end: Number,
  count: Number,
  comments: Boolean,
  assignees: [String],
})

const Board = new mongoose.model('Board', boardSchema)

module.exports = Board