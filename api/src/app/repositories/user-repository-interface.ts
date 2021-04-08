import { User } = require('../models/sequelize')

interface UserRepositoryInterface {
  create(properties): Promise<User>;
  findOne(criteria): Promise<User>;
  findAll(criteria): Promise<Array<User>>;
  find(id: string): Promise<User>;
}

export default UserRepositoryInterface