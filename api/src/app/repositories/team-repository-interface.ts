import Team = require('../models/sequelize/team')

interface TeamRepositoryInterface {
  create(members, owner, title): Promise<Team>;
  find(id: string): Promise<Team>;
  findAll(criteria): Promise<Array<Team>>;
  delete(id);
  deleteOne(criteria);
}

export default TeamRepositoryInterface