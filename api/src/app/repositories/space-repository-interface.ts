import Space = require('../models/space')

interface SpaceRepositoryInterface {
  create(title, team, owner): Promise<Space>;
  find(id: string): Promise<Space>;
  findAll(criteria): Promise<Array<Space>>;
  delete(id);
}

export default SpaceRepositoryInterface