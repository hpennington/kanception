import TeamInvite = require('../models/sequelize/team-invite')

interface TeamInviteRepositoryInterface {
  create(team, invitee): Promise<TeamInvite>;
  findAll(criteria): Promise<Array<TeamInvite>>;
  findOne(criteria): Promise<TeamInvite>;
  deleteOne(criteria);
}

export default TeamInviteRepositoryInterface