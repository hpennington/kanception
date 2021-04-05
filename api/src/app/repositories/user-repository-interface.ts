import User = require('../models/user')

interface UserRepositoryInterface {
  findOne(criteria): Promise<User>;
}

export default UserRepositoryInterface