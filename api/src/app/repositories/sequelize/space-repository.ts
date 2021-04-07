import SpaceRepositoryInterface from '../space-repository-interface'
import Space from '../../models/sequelize/space'
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class SpaceRepository implements SpaceRepositoryInterface {
  async create(title, team, owner) {
  	const space = await Space.create({title: title, team: team, owner: owner})
  	return space
  }

  async find(id: string): Promise<Space> {
    const space = await Space.findById(new ObjectId(id))
    return space
  }

  async findOne(criteria): Promise<Space> {
    const space = await Space.findOne(criteria)
    return space
  }

  async findAll(criteria): Promise<Array<Space>> {
  	const spaces = await Space.find(criteria)
  	return spaces
  }

  async delete(id: string) {
  	await Space.deleteOne({_id: id})
  }
}

export default SpaceRepository