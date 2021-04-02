import Assignment = require('../models/assignment')
import Board = require('../models/board')

interface AssignmentRepositoryInterface {
  findAllByBoard(board: Board): Promise<Array<Assignment>>;
  create(assignee, assigner, board): Promise<Assignment>;
  deleteMany(criteria);
}

export default AssignmentRepositoryInterface