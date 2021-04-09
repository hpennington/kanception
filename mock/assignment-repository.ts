import AssignmentRepositoryInterface from '../assignment-repository-interface'
import Assignment = require('../../models/assignment')
import Board = require('../../models/board')

class AssignmentRepository implements AssignmentRepositoryInterface {
  async create(assignee, assigner, board): Promise<Assignment> {
    const group = {
      assigner: assigner,
      assignee: assignee,
      board: board._id,
    }

    return group
  }

  async findAll(criteria): Promise<Array<Assignment>> {
    return []
  }

  async findOne(criteria): Promise<Assignment> {
    return null
  }

  async deleteMany(criteria) {
   
  }

  async deleteOne(criteria) {
   
  }
}

export default AssignmentRepository