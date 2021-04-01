import Group = require('../models/group')

interface GroupRepositoryInterface {
  async create(title, owner, order, board): Promise<Group>;
}

export default GroupRepositoryInterface      