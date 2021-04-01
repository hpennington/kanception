import User = require('../models/user')

interface UserRepositoryInterface {
  async findBySub(sub: string): Promise<User>;
}

export default UserRepositoryInterface