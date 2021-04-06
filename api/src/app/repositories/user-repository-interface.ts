import User = require('../models/user')

interface UserRepositoryInterface {
  findOne(criteria): Promise<User>;
  find(id: string): Promise<User>;
}

export default UserRepositoryInterface