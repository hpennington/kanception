const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  owner: String,
  board: String,
  text: String,
  timestamp: String,
})

const Comment = new mongoose.model('Comment', commentSchema)

module.exports = Comment