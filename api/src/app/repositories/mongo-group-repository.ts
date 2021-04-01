
import GroupRepositoryInterface from './group-repository-interface'
import Group = require('../models/group')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class MongoGroupRepository implements GroupRepositoryInterface {
  async create(title, owner, order, board): Promise<Group> {
    const group = await Group.create({
      title: title,
      owner: owner._id,
      order: order,
      board: board._id,
    })

    return group
  }
}

export default MongoGroupRepository