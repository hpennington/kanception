import TeamRepositoryInterface from '../team-repository-interface'
import Team = require('../../models/mongo/team')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class TeamRepository implements TeamRepositoryInterface {
  async create(members, owner, title): Promise<Team> {
    if (owner === null && title === null) {
      const team = await Team.create({
        members: members
      })
      return team
    } else {
      const team = await Team.create({
        members: members,
        owner: owner,
        title: title,
      })
      return team  
    }
    
  }

  async find(id: string): Promise<Team> {
    const team = await Team.findById(new ObjectId(id))
    return team
  }

  async findAll(criteria): Promise<Array<Team>> {
  	const teams = await Team.find(criteria)
  	return teams
  }
  
  async findOne(criteria): Promise<Team> {
  	const team = await Team.findOne(criteria)
  	return team
  }

  async delete(id: string) {
  	await Team.deleteOne({_id: id})
  }

  async deleteOne(criteria) {
    await Team.deleteOne(criteria)
  }
}

export default TeamRepository
