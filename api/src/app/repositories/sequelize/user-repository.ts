import UserRepositoryInterface from '../user-repository-interface'
import { User } from '../../models/sequelize'

class UserRepository implements UserRepositoryInterface {
  constructor() {
    this.create = this.create.bind(this)
    this.findOne = this.findOne.bind(this)
    this.findAll = this.findAll.bind(this)
    this.find = this.find.bind(this)
  }

  async create(properties): Promise<User> {
    const user = await User.create(properties)
    return user
  }

  async findOne(criteria): Promise<User> {
  	const user = await User.findOne({where: criteria})
  	return user
  }

  async findAll(criteria): Promise<Array<User>> {
    const users = await User.findAll({where: criteria})
    return users
  }

  async find(id: string): Promise<User> {
    const user = await User.findOne({where: {_id: id}})
  	return user	
  }
}

export default UserRepository