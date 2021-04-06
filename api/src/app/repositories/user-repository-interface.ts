import User = require('../models/user')

interface UserRepositoryInterface {
  create(first, last, email, active, spaces): Promise<User>;
  findOne(criteria): Promise<User>;
  find(id: string): Promise<User>;
}

export default UserRepositoryInterface