import TeamRepositoryInterface from '../team-repository-interface'
import { Team } from '../../models/sequelize'

class TeamRepository implements TeamRepositoryInterface {
  async create(id, members, owner, title): Promise<Team> {
    if (owner === null && title === null) {
      const team = await Team.create({
        _id: id,
        members: members
      })
      return team
    } else {
      const team = await Team.create({
        _id: id,
        members: members,
        owner: owner,
        title: title,
      })
      return team  
    }
    
  }

  async find(id: string): Promise<Team> {
    const team = await Team.findOne({where: {_id: id}})
    return team
  }

  async findAll(criteria): Promise<Array<Team>> {
  	const teams = await Team.findAll({where: criteria})
  	return teams
  }

  async delete(id: string) {
  	await Team.deleteOne({where: {_id: id}})
  }

  async deleteOne(criteria) {
    await Team.deleteOne({where: criteria})
  }
}

export default TeamRepository