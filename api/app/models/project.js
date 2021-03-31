const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  title: String,
  space: String,
  owner: String,
})

const Project = new mongoose.model('Project', projectSchema)

module.exports = Project