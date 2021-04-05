import AssignmentRepositoryInterface from '../assignment-repository-interface'
import Board = require('../../models/board')
import Assignment = require('../../models/assignment')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class AssignmentRepository implements AssignmentRepositoryInterface {
  async findAllByBoard(board: Board): Promise<Array<Assignment>> {
    const assignments = await Assignment.find({board: board._id})
    return assignments
  }

  async findAll(criteria): Promise<Array<Assignment>> {
   	const assignments = await Assignment.find(criteria)
  	return assignments
  }

  async findOne(criteria): Promise<Assignment> {
  	const assignment = await Assignment.findOne(criteria)
  	return assignment
  }

  async create(assignee, assigner, board): Promise<Assignment> {
  }

  async deleteMany(criteria) {
  	await Assignment.deleteMany(criteria)
  }

  async deleteOne(criteria) {
  	await Assignment.deleteOne(criteria)	
  }
}

export default AssignmentRepository