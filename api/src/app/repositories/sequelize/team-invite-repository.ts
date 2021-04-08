import TeamInviteRepositoryInterface from '../team-invite-repository-interface'
import { TeamInvite } from '../../models/sequelize'

class TeamInviteRepository implements TeamInviteRepositoryInterface {
  async create(team, invitee): Promise<TeamInvite> {
    const invite = await TeamInvite.create({
      team: team,
      invitee: invitee
    })
    return invite
  }

  async findAll(criteria): Promise<Array<TeamInvite>> {
    const invites = await TeamInvite.findAll({where: criteria})
    return invites
  }

  async findOne(criteria): Promise<TeamInvite> {
    const invitation = await TeamInvite.findOne({where: criteria})
    return invitation
  }

  async deleteOne(criteria) {
    await TeamInvite.deleteOne({where: criteria})
  }
}

export default TeamInviteRepository