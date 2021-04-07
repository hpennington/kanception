import Assignment = require('../models/sequelize/assignment')
import Board = require('../models/sequelize/board')

interface AssignmentRepositoryInterface {
  findAll(criteria): Promise<Array<Assignment>>;
  findOne(criteria): Promise<Assignment>;
  create(assignee, assigner, board): Promise<Assignment>;
  deleteMany(criteria);
  deleteOne(criteria);
}

export default AssignmentRepositoryInterface