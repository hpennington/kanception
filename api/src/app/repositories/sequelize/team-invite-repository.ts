import TeamInviteRepositoryInterface from '../team-invite-repository-interface'
import TeamInvite from '../../models/sequelize/team-invite'

class TeamInviteRepository implements TeamInviteRepositoryInterface {
  async create(team, invitee): Promise<TeamInvite> {
    const invite = await TeamInvite.create({
      team: team,
      invitee: invitee
    })
    return invite
  }

  async findAll(criteria): Promise<Array<TeamInvite>> {
    const invites = await TeamInvite.find(criteria)
    return invites
  }

  async findOne(criteria): Promise<TeamInvite> {
    const invitation = await TeamInvite.findOne(criteria)
    return invitation
  }

  async deleteOne(criteria) {
    await TeamInvite.deleteOne(criteria)
  }
}

export default TeamInviteRepository