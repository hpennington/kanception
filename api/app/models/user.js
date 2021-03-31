const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  sub: String,
  name: {
    first: String,
    last: String,
  },
  spaces: [String],
  active: Boolean,
})

const User = new mongoose.model('User', userSchema)

module.exports = User