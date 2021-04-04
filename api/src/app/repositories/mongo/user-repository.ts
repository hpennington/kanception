import UserRepositoryInterface from '../user-repository-interface'
import User = require('../../models/user')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class UserRepository implements UserRepositoryInterface {
  async findBySub(sub: string): Promise<User> {
    const user = await User.findOne({sub: sub})
    return user
  }
}

export default UserRepository