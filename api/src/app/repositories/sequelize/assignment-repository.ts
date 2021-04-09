import { uuid } from 'uuidv4'
import AssignmentRepositoryInterface from '../assignment-repository-interface'
import { Board } from '../../models/sequelize'
import { Assignment } from '../../models/sequelize'

class AssignmentRepository implements AssignmentRepositoryInterface {
  async findAll(criteria): Promise<Array<Assignment>> {
   	const assignments = await Assignment.findAll({where: criteria})
  	return assignments
  }

  async findOne(criteria): Promise<Assignment> {
  	const assignment = await Assignment.findOne({where: criteria})
  	return assignment
  }

  async create(assignee, assigner, board): Promise<Assignment> {
    const _id = uuid()
    const assignment = await Assignment.create({_id, assignee, assigner, board})
    return assignment
  }

  async deleteMany(criteria) {
  	await Assignment.destroy({where: criteria})
  }

  async deleteOne(criteria) {
  	await Assignment.destroy({where: criteria})	
  }
}

export default AssignmentRepository