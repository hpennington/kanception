import { Member } = require('../models/sequelize')

interface MemberRepositoryInterface {
  findAll(criteria): Promise<Array<Member>>;
}

export default MemberRepositoryInterface