import Group = require('../models/group')

interface GroupRepositoryInterface {
  create(title, owner, order, board): Promise<Group>;
  find(id: string): Promise<Group>;
  findAll(criteria): Promise<Array<Group>>;
  delete(id: string);
}

export default GroupRepositoryInterface      