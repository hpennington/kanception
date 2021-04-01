import Assignment = require('../models/assignment')
import Board = require('../models/board')

interface AssignmentRepositoryInterface {
  async findAllByBoard(board: Board): Promise<Array<Assignment>>;
}

export default AssignmentRepositoryInterface