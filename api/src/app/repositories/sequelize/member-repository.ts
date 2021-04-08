import MemberRepositoryInterface from '../member-repository-interface'
import { Member } from '../../models/sequelize'

class MemberRepository implements MemberRepositoryInterface {
  async create(properties): Promise<Member> {
  	const member = await Member.create(properties)
  	return member
  }

  async findAll(criteria): Promise<Array<Member>> {
  	const members = await Member.findAll({where: criteria})
  	return members
  }
}

export default MemberRepository