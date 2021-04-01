import Assignment = require('../models/assignment')
import Board = require('../models/board')

interface AssignmentRepositoryInterface {
  async findAllByBoard(board: Board): Promise<Array<Assignment>>;
  async create(assignee, assigner, board): Promise<Assignment>;
}

export default AssignmentRepositoryInterface