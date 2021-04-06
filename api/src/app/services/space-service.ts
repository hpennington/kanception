import BoardService from '../services/board-service'
import BoardRepositoryInterface from '../repositories/board-repository-interface'
import UserRepositoryInterface from '../repositories/user-repository-interface'
import GroupRepositoryInterface from '../repositories/group-repository-interface'
import AssignmentRepositoryInterface from '../repositories/assignment-repository-interface'
import CommentRepositoryInterface from '../repositories/comment-repository-interface'
import TeamRepositoryInterface from '../repositories/team-repository-interface'
import SpaceRepositoryInterface from '../repositories/space-repository-interface'
import ProjectRepositoryInterface from '../repositories/project-repository-interface'

class SpaceService {
  private boardService: BoardService
  private boardRepository: BoardRepositoryInterface
  private userRepository: UserRepositoryInterface
  private groupRepository: GroupRepositoryInterface
  private assignmentRepository: AssignmentRepositoryInterface
  private commentRepository: CommentRepositoryInterface
  private teamRepository: TeamRepositoryInterface
  private spaceRepository: SpaceRepositoryInterface
  private projectRepository: ProjectRepositoryInterface

  constructor(
    boardRepository: BoardRepositoryInterface,
    userRepository: UserRepositoryInterface,
    groupRepository: GroupRepositoryInterface,
    assignmentRepository: AssignmentRepositoryInterface,
    commentRepository: CommentRepositoryInterface,
    teamRepository: TeamRepositoryInterface,
    spaceRepository: SpaceRepositoryInterface,
    projectRepository: ProjectRepositoryInterface,
    boardService: BoardService
  ) {
    this.boardRepository = boardRepository
    this.userRepository = userRepository
    this.groupRepository = groupRepository
    this.assignmentRepository = assignmentRepository
    this.commentRepository = commentRepository
    this.teamRepository = teamRepository
    this.spaceRepository = spaceRepository
    this.projectRepository = projectRepository
    this.boardService = boardService
  }

  public async createSpace(sub, title) {
    try {
      const owner = await this.userRepository.findOne({sub: sub})
      const team = await this.teamRepository.create([owner._id], null, null)
      const space = await this.spaceRepository.create(title, team._id, owner._id)

      owner.spaces.push(space._id)
      owner.save()

      return space

    } catch(error) {
      throw error
    }
  }

  public async readSpaces(sub) {
  	try {

  	  const owner = await this.userRepository.findOne({sub: sub})

  	  const spaces = []

  	  for (const spaceId of owner.spaces) {
  	    const space = await this.spaceRepository.find(spaceId)
  	    spaces.push(space)
  	  }

  	  return spaces

  	} catch(error) {
  	  throw error
  	}
  }

  public async deleteSpace(sub, id) { 
    try {

      const user = await this.userRepository.findOne({sub: sub})
      const space = await this.spaceRepository.find(id)
      const team = await this.teamRepository.find(space.team)

      if (user._id != space.owner) {
        
        return false
      }

      const projects = await this.projectRepository.findAll({space: id})

      for (const project of projects) {

        const boards = await this.boardRepository.findAll({project: project._id})

        await this.boardService.recursiveDelete(boards.map(board => board._id))

        const result = await this.projectRepository.delete(project._id)
      }

      for (const member of team.members) {
        const teamMember = await this.userRepository.find(member)
        teamMember.spaces = teamMember.spaces.filter(s => s !== id)
        teamMember.save()
      }

      const result = await this.spaceRepository.delete(id)
      const result2 = await this.teamRepository.delete(space.team)

      return true
    } catch(error) {
      throw error
    }
  }
}

export default SpaceService