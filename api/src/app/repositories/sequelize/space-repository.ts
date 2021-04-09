import SpaceRepositoryInterface from '../space-repository-interface'
import { Space } from '../../models/sequelize'
import { uuid } from 'uuidv4'

class SpaceRepository implements SpaceRepositoryInterface {
  async create(title, team, owner) {
  	const space = await Space.create({_id: uuid(), title: title, team: team, owner: owner})
  	return space
  }

  async find(id: string): Promise<Space> {
    const space = await Space.findOne({where: {_id: id}})
    return space
  }

  async findOne(criteria): Promise<Space> {
    const space = await Space.findOne({where: criteria})
    return space
  }

  async findAll(criteria): Promise<Array<Space>> {
  	const spaces = await Space.findAll({where: criteria})
  	return spaces
  }

  async delete(id: string) {
  	await Space.destroy({where: {_id: id}})
  }
}

export default SpaceRepository