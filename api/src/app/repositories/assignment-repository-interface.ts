import Assignment = require('../models/assignment')
import Board = require('../models/board')

interface AssignmentRepositoryInterface {
  findAllByBoard(board: Board): Promise<Array<Assignment>>;
  findAll(criteria): Promise<Array<Assignment>>;
  create(assignee, assigner, board): Promise<Assignment>;
  findOne(criteria): Promise<Assignment>;
  deleteMany(criteria);
  deleteOne(criteria);
}

export default AssignmentRepositoryInterface