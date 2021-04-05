import TeamRepositoryInterface from '../team-repository-interface'
import Team = require('../../models/team')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class TeamRepository implements TeamRepositoryInterface {
  async find(id: string): Promise<Team> {
    const team = await Team.findById(new ObjectId(id))
    return team
  }

  async findAll(criteria): Promise<Array<Team>> {
  	const teams = await Team.find(criteria)
  	return teams
  }
}

export default TeamRepository