import { uuid }from 'uuidv4'
import BoardRepositoryInterface from '../repositories/board-repository-interface'
import UserRepositoryInterface from '../repositories/user-repository-interface'
import GroupRepositoryInterface from '../repositories/group-repository-interface'
import SpaceRepositoryInterface from '../repositories/space-repository-interface'
import TeamRepositoryInterface from '../repositories/team-repository-interface'

class TeamService {
  private boardRepository: BoardRepositoryInterface
  private userRepository: UserRepositoryInterface
  private groupRepository: GroupRepositoryInterface
  private spaceRepository: SpaceRepositoryInterface
  private teamRepository: TeamRepositoryInterface

  constructor(
    boardRepository: BoardRepositoryInterface,
    userRepository: UserRepositoryInterface,
    groupRepository: GroupRepositoryInterface,
    spaceRepository: SpaceRepositoryInterface,
    teamRepository: TeamRepositoryInterface
  ) {
    this.boardRepository = boardRepository
    this.userRepository = userRepository
    this.groupRepository = groupRepository
    this.spaceRepository = spaceRepository
    this.teamRepository = teamRepository
  }

  public async createTeam(sub, title) {
    try {
      const owner = await this.userRepository.findOne({sub: sub})
      if (owner === null) {
        throw new Error("User is null")
      }

      const team = await this.teamRepository.create(uuid(), [owner._id], owner._id, title)

      owner.spaces.push(team._id)
      owner.save()

      const groupBacklog = await this.groupRepository.create("Backlog", team._id, 0, undefined)
      const groupTodo = await this.groupRepository.create("To-do", team._id, 1, undefined)
      const groupInProgress = await this.groupRepository.create("In progress", team._id, 2, undefined)
      const groupReview = await this.groupRepository.create("Review", team._id, 3, undefined)
      const groupDone = await this.groupRepository.create("Done", team._id, 4, undefined)

      const groups = [groupBacklog, groupTodo, groupInProgress, groupReview, groupDone]

      const teamRoot = await this.boardRepository.create({
        _id: uuid(),
        title: title,
        owner: team._id,
        groups: groups.map(group => group._id),
        order: 0,
        parent: null,
        team: team._id,
        group: null,
        isTeamRoot: true,
        isUserRoot: false,
        count: 0,
        comments: false,
      })

      return team

    } catch(error) {
      throw error
    }
  }

  public async readTeamRootsChildren(team) {
    try {

      const root = await this.boardRepository.findAll({team: team, group: null})

      if (root.length === 0) {
        return null
      }

      return root

      } catch(error) {
        throw error
      }
  }

  public async readTeam(sub, teamId) {
    try {
      const owner = await this.userRepository.findOne({sub: sub})
      if (owner === null) {
        return null
      }

      const space = await this.spaceRepository.find(teamId)

      if (owner.spaces.includes(space._id) === false) {
        return null
      }

      const team = await this.teamRepository.find(space.team)

      if (team === null) {
        return null
      }

      return team

    } catch (error) {
      throw error
    }
  }
}

export default TeamService