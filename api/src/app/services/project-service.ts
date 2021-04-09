import { uuid } from 'uuidv4'
import BoardService from '../services/board-service'
import BoardRepositoryInterface from '../repositories/board-repository-interface'
import UserRepositoryInterface from '../repositories/user-repository-interface'
import GroupRepositoryInterface from '../repositories/group-repository-interface'
import AssignmentRepositoryInterface from '../repositories/assignment-repository-interface'
import CommentRepositoryInterface from '../repositories/comment-repository-interface'
import ProjectRepositoryInterface from '../repositories/project-repository-interface'
import SpaceRepositoryInterface from '../repositories/space-repository-interface'
import MemberRepositoryInterface from '../repositories/member-repository-interface'

class ProjectService {
  private boardRepository: BoardRepositoryInterface
  private userRepository: UserRepositoryInterface
  private groupRepository: GroupRepositoryInterface
  private assignmentRepository: AssignmentRepositoryInterface
  private commentRepository: CommentRepositoryInterface
  private projectRepository: ProjectRepositoryInterface
  private spaceRepository: SpaceRepositoryInterface
  private memberRepository: MemberRepositoryInterface
  private boardService: BoardService

  constructor(
    boardRepository: BoardRepositoryInterface,
    userRepository: UserRepositoryInterface,
    groupRepository: GroupRepositoryInterface,
    assignmentRepository: AssignmentRepositoryInterface,
    commentRepository: CommentRepositoryInterface,
    projectRepository: ProjectRepositoryInterface,
    spaceRepository: SpaceRepositoryInterface,
    memberRepository: MemberRepositoryInterface,
    boardService: BoardService
  ) {
    this.boardRepository = boardRepository
    this.userRepository = userRepository
    this.groupRepository = groupRepository
    this.assignmentRepository = assignmentRepository
    this.commentRepository = commentRepository
    this.projectRepository = projectRepository
    this.spaceRepository = spaceRepository
    this.memberRepository = memberRepository
    this.boardService = boardService
  }

  public async createProject(sub, title, space) {
    try {
      const owner = await this.userRepository.findOne({sub: sub})
      const project = await this.projectRepository.create(title, space, owner._id)
      const projectRoot = await this.boardRepository.create({
        _id: uuid(),
        title: title,
        description: "",
        owner: owner._id,
        order: 0,
        project: project._id,
        parent: null,
        group: null,
        count: 0,
        comments: false,
      })

      const groupBacklog = await this.groupRepository.create("Backlog", owner._id, 0, projectRoot._id)
      const groupTodo = await this.groupRepository.create("To-do", owner._id, 1, projectRoot._id)
      const groupInProgress = await this.groupRepository.create("In progress", owner._id, 2, projectRoot._id)
      const groupReview = await this.groupRepository.create("Review", owner._id, 3, projectRoot._id)
      const groupDone = await this.groupRepository.create("Done", owner._id, 4, projectRoot._id)

      return project

    } catch(error) {
      throw error
    }
  }

  public async readProjects(sub) {
    try {

      const owner = await this.userRepository.findOne({sub: sub})

      const teams = (await this.memberRepository.findAll({user: owner._id}))
        .map(member => member.team)

      const projects = []

      for (const team of teams) {
        const space = await this.spaceRepository.findOne({team: team})
        const projectsResult = await this.projectRepository.findAll({space: space._id})
        projects.push(...projectsResult)
      }

      return projects

    } catch(error) {
      throw error
    }
  }

  public async deleteProject(sub, id) {
    try {
    
      const owner = await this.userRepository.findOne({sub: sub})
      const project = await this.projectRepository.find(id)
      if (owner._id == project.owner) {
        const boards = await this.boardRepository.findAll({project: id})
        await this.boardService.recursiveDelete(boards.map(board => board._id))
        const deleteResult = await this.projectRepository.delete(id)
        return true
      } else {
        return false
      }

    } catch(error) {
      throw error
    }
  }
}

export default ProjectService