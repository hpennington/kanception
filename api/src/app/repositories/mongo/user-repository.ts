import UserRepositoryInterface from '../user-repository-interface'
import User = require('../../models/mongo/user')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class UserRepository implements UserRepositoryInterface {
  async create(properties): Promise<User> {
    const user = await User.create(properties)
    return user
  }

  async findOne(criteria): Promise<User> {
  	const user = await User.findOne(criteria)
  	return user
  }

  async findAll(criteria): Promise<Array<User>> {
    const users = await User.find(criteria)
    return users
  }

  async find(id: string): Promise<User> {
    const user = await User.findById(new ObjectId(id))
  	return user	
  }
}

export default UserRepository