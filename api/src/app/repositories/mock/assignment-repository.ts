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

  async findAllByBoard(board: Board): Promise<Array<Assignment>> {
  	return []
  }

  async deleteMany(criteria) {
    
  }
}

export default AssignmentRepository