import UserRepositoryInterface from '../user-repository-interface'
import User = require('../../models/user')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class UserRepository implements UserRepositoryInterface {
  async create(first, last, email, active, spaces): Promise<User> {
  	const user = await User.create(
      {name: {
        first: first,
        last: last
      }, email: email,
        active: active,
        spaces: spaces
    })
    return user
  }

  async findOne(criteria): Promise<User> {
  	const user = await User.findOne(criteria)
  	return user
  }
  async find(id: string): Promise<User> {
    const user = await User.findById(new ObjectId(id))
  	return user	
  }
}

export default UserRepository