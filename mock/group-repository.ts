import GroupRepositoryInterface from '../group-repository-interface'
import Group = require('../../models/group')

class GroupRepository implements GroupRepositoryInterface {
  async create(title, owner, order, board): Promise<Group> {
    const group = {
      title: title,
      owner: owner._id,
      order: order,
      board: board._id,
    }

    return group
  }
}

export default GroupRepository