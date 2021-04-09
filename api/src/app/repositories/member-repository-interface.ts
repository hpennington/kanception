import { Member } from '../models/sequelize'

interface MemberRepositoryInterface {
  create(properties): Promise<Member>;
  findAll(criteria): Promise<Array<Member>>;
}

export default MemberRepositoryInterface
