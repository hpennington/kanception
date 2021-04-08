import MemberRepositoryInterface from '../member-repository-interface'
import { Member } from '../../models/sequelize'

class MemberRepository implements MemberRepositoryInterface {
  async findAll(criteria): Promise<Array<Member>> {
  	const members = await Member.findAll({where: criteria})
  	return members
  }
}

export default MemberRepository