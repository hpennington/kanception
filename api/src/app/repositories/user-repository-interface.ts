import User = require('../models/user')

interface UserRepositoryInterface {
  findBySub(sub: string): Promise<User>;
}

export default UserRepositoryInterface