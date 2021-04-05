import SpaceRepositoryInterface from '../space-repository-interface'
import Space = require('../../models/space')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class SpaceRepository implements SpaceRepositoryInterface {
  async find(id: string): Promise<Space> {
    const space = await Space.findById(new ObjectId(id))
    return space
  }

  async findAll(criteria): Promise<Array<Space>> {
  	const spaces = await Space.find(criteria)
  	return spaces
  }
}

export default SpaceRepository