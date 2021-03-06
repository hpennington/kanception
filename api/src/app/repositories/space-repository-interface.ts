import { Space } from '../models/sequelize'

interface SpaceRepositoryInterface {
  create(title, team, owner): Promise<Space>;
  find(id: string): Promise<Space>;
  findAll(criteria): Promise<Array<Space>>;
  findOne(criteria): Promise<Space>;
  delete(id);
}

export default SpaceRepositoryInterface
