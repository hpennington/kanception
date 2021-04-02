import Group = require('../models/group')

interface GroupRepositoryInterface {
  create(title, owner, order, board): Promise<Group>;
}

export default GroupRepositoryInterface      