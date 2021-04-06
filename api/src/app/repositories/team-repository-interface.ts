import Team = require('../models/space')

interface TeamRepositoryInterface {
  create(members): Promise<Team>;
  find(id: string): Promise<Team>;
  findAll(criteria): Promise<Array<Team>>;
  delete(id);
}

export default TeamRepositoryInterface