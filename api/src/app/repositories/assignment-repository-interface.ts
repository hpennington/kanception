import { Assignment } from '../models/sequelize'
import { Board } from '../models/sequelize'

interface AssignmentRepositoryInterface {
  findAll(criteria): Promise<Array<Assignment>>;
  findOne(criteria): Promise<Assignment>;
  create(assignee, assigner, board): Promise<Assignment>;
  deleteMany(criteria);
  deleteOne(criteria);
}

export default AssignmentRepositoryInterface
