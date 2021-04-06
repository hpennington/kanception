import TeamRepositoryInterface from '../team-repository-interface'
import Team = require('../../models/team')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class TeamRepository implements TeamRepositoryInterface {
  async create(members): Promise<Team> {
	const team = await Team.create({members: members})
	return team
  }

  async find(id: string): Promise<Team> {
    const team = await Team.findById(new ObjectId(id))
    return team
  }

  async findAll(criteria): Promise<Array<Team>> {
  	const teams = await Team.find(criteria)
  	return teams
  }

  async delete(id: string) {
  	await Team.deleteOne({_id: id})
  }
}

export default TeamRepository