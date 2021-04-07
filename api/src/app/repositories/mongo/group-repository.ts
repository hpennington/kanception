import GroupRepositoryInterface from '../group-repository-interface'
import Group = require('../../models/mongo/group')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class GroupRepository implements GroupRepositoryInterface {
  async create(title, owner, order, board): Promise<Group> {
    const group = await Group.create({
      title: title,
      owner: owner._id,
      order: order,
      board: board._id,
    })

    return group
  }

  async find(id: string): Promise<Group> {
    const group = await Group.findById(new ObjectId(id))
    return group
  }

  async findAll(criteria): Promise<Array<Group>> {
  	const groups = await Group.find(criteria)
  	return groups
  }

  async delete(id: string) {
  	await Group.deleteOne({_id: id})
  }
}

export default GroupRepository