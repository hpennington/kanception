import AssignmentRepositoryInterface from '../assignment-repository-interface'
import Board from '../../models/sequelize/board'
import Assignment from '../../models/sequelize/assignment'

class AssignmentRepository implements AssignmentRepositoryInterface {
  async findAll(criteria): Promise<Array<Assignment>> {
   	const assignments = await Assignment.find(criteria)
  	return assignments
  }

  async findOne(criteria): Promise<Assignment> {
  	const assignment = await Assignment.findOne({where: criteria})
  	return assignment
  }

  async create(assignee, assigner, board): Promise<Assignment> {
    const assignment = await Assignment.create({assignee, assigner, board})
    return assignment
  }

  async deleteMany(criteria) {
  	await Assignment.deleteMany(criteria)
  }

  async deleteOne(criteria) {
  	await Assignment.deleteOne(criteria)	
  }
}

export default AssignmentRepository