import { Team } from '../models/sequelize'

interface TeamRepositoryInterface {
  create(id, members, owner, title): Promise<Team>;
  find(id: string): Promise<Team>;
  findOne(criteria): Promise<Team>;
  findAll(criteria): Promise<Array<Team>>;
  delete(id);
  deleteOne(criteria);
}

export default TeamRepositoryInterface
