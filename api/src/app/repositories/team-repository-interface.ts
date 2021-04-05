import Team = require('../models/space')

interface TeamRepositoryInterface {
  find(id: string): Promise<Team>;
  findAll(criteria): Promise<Array<Team>>;
}

export default TeamRepositoryInterface