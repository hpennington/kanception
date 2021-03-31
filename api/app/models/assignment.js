const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  assignee: String,
  assigner: String,
  board: String,
})

const Assignment = new mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment