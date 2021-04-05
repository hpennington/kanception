import UserRepositoryInterface from '../repositories/user-repository-interface'
import CommentRepositoryInterface from '../repositories/comment-repository-interface'
import BoardRepositoryInterface from '../repositories/board-repository-interface'
import ProjectRepositoryInterface from '../repositories/project-repository-interface'
import SpaceRepositoryInterface from '../repositories/space-repository-interface'
import TeamRepositoryInterface from '../repositories/team-repository-interface'

class CommentService {
  private userRepository: UserRepositoryInterface
  private commentRepository: CommentRepositoryInterface
  private boardRepository: BoardRepositoryInterface
  private projectRepository: ProjectRepositoryInterface
  private spaceRepository: SpaceRepositoryInterface
  private teamRepository: TeamRepositoryInterface

  constructor(
    userRepository: UserRepositoryInterface,
    commentRepository: CommentRepositoryInterface,
    boardRepository: BoardRepositoryInterface,
    projectRepository: ProjectRepositoryInterface,
    spaceRepository: SpaceRepositoryInterface,
    teamRepository: TeamRepositoryInterface,
  ) {
    this.userRepository = userRepository
    this.commentRepository = commentRepository
    this.boardRepository = boardRepository
    this.projectRepository = projectRepository
    this.spaceRepository = spaceRepository
    this.teamRepository = teamRepository
  }

  public async createComment(text, boardId, sub) {
    try {
      const timestamp = new Date().getTime()

      const user = await this.userRepository.findOne({sub: sub})

      const comment = await this.commentRepository.create(user._id, boardId, timestamp ,text)

      const board = await this.boardRepository.find(boardId)
      if (board.comments === false || board.comments === undefined) {
        board.comments = true
        board.save()
      }

      return comment 
    } catch(error) {
      throw error
    }
  }

  public async readComments(sub, boardId) {
    try {
      const user = await this.userRepository.findOne({sub: sub})
      const board = await this.boardRepository.find(boardId)
      const project = await this.projectRepository.find(board.project)
      const space = await this.spaceRepository.find(project.space)
      const team = await this.teamRepository.find(space.team)

      if (team.members.includes(user._id)) {
        const comments = await this.commentRepository.findAll({board: boardId})
        console.log(comments)
        return comments.sort((a, b) => +(parseInt(a.timestamp) < parseInt(b.timestamp)))
      }

      return null
    } catch(error) {
      throw error
    }
  }
}

export default CommentService