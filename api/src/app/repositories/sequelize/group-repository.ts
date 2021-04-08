import GroupRepositoryInterface from '../group-repository-interface'
import { Group } from '../../models/sequelize'
import { uuid } from 'uuidv4'

class GroupRepository implements GroupRepositoryInterface {
  async create(title, owner, order, board): Promise<Group> {
    const group = await Group.create({
      _id: uuid(),
      title: title,
      owner: owner._id,
      order: order,
      board: board._id,
    })

    return group
  }

  async find(id: string): Promise<Group> {
    const group = await Group.findOne({where: {_id: id}})
    return group
  }

  async findAll(criteria): Promise<Array<Group>> {
  	const groups = await Group.findAll({where: criteria})
  	return groups
  }

  async delete(id: string) {
  	await Group.deleteOne({where: {_id: id}})
  }
}

export default GroupRepository