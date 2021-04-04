import AssignmentRepositoryInterface from '../assignment-repository-interface'
import Board = require('../../models/board')
import Assignment = require('../../models/assignment')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class MongoAssignmentRepository implements AssignmentRepositoryInterface {
  async findAllByBoard(board: Board): Promise<Array<Assignment>> {
    const assignments = await Assignment.find({board: board._id})
    return assignments
  }

  async create(assignee, assigner, board): Promise<Assignment> {
  }

  async deleteMany(criteria) {
  	await Assignment.deleteMany(criteria)
  }
}

export default MongoAssignmentRepository