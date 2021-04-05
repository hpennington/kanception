import Space = require('../models/space')

interface SpaceRepositoryInterface {
  find(id: string): Promise<Space>;
  findAll(criteria): Promise<Array<Space>>;
}

export default SpaceRepositoryInterface