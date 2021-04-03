const User = require('../models/user')
import Assignment from '../models/assignment'

class AssignmentService {
  public async createAssignment(sub, assignee, board) {
    try {
      const user = await User.findOne({sub: sub})
      const assigner = user._id
      const currentAssignment = await Assignment.findOne({
        board: board,
        assignee: assignee,
      })

      if (currentAssignment != null) {
        return currentAssignment
      }

      const assignment = await Assignment.create({
        assignee: assignee,
        assigner: assigner,
        board: board,
      })

      return assignment

    } catch(error) {
      throw error
    }
  }

  public async readAssignments(sub) {
    try {
      const user = await User.findOne({sub: sub})
      const assignments = await Assignment.find({assignee: user._id})
      return assignments
    } catch(error) {
      throw error
    }
  }

  public async deleteAssignment(board, assignee) {
    try {

      const result = await Assignment.deleteOne({
        board: board,
        assignee: assignee
      })

      return result

    } catch(error) {
      throw error
    }
  }
}

export default AssignmentService