import { TeamInvite } = require('../models/sequelize')

interface TeamInviteRepositoryInterface {
  create(team, invitee): Promise<TeamInvite>;
  findAll(criteria): Promise<Array<TeamInvite>>;
  findOne(criteria): Promise<TeamInvite>;
  deleteOne(criteria);
}

export default TeamInviteRepositoryInterface