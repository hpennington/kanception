import AssignmentRepositoryInterface from './assignment-repository-interface'
import Board = require('../models/user')
import Assignment = require('../models/user')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class MongoAssignmentRepository implements AssignmentRepositoryInterface {
  async findAllByBoard(board: Board): Promise<Array<Assignment>> {
    const assignments = await Assignment.find({board: board._id})
    return assignments
  }
}

export default MongoAssignmentRepository