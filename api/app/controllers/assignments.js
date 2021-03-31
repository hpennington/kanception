const User = require('../models/user')
const Assignment = require('../models/assignment')

const readAssignments = async (req, res) => {
  try {
    const user = await User.findOne({sub: req.user.sub})
    const assignments = await Assignment.find({assignee: user._id})
    res.send(assignments)
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const createAssignment = async (req, res) => {
  const user = await User.findOne({sub: req.user.sub})
  const assigner = user._id
  const assignee = req.query.assignee
  const board = req.query.board

  try {

    const currentAssignment = await Assignment.findOne({
      board: board,
      assignee: assignee,
    })

    if (currentAssignment != null) {
      res.send(currentAssignment)
      return
    }

    const assignment = await Assignment.create({
      assignee: assignee,
      assigner: assigner,
      board: board,
    })

    res.send(assignment)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const deleteAssignment = async (req, res) => {
  const board = req.query.board
  const assignee = req.query.assignee

  try {

    const result = await Assignment.deleteOne({
      board: board,
      assignee: assignee
    })

    res.sendStatus(204)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { createAssignment, readAssignments, deleteAssignment }