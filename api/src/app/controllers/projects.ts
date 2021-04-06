import BoardService from '../services/board-service'
import ProjectService from '../services/project-service'
import BoardRepository from '../repositories/mongo/board-repository'
import UserRepository from '../repositories/mongo/user-repository'
import GroupRepository from '../repositories/mongo/group-repository'
import AssignmentRepository from '../repositories/mongo/assignment-repository'
import CommentRepository from '../repositories/mongo/comment-repository'
import ProjectRepository from '../repositories/mongo/project-repository'
import SpaceRepository from '../repositories/mongo/space-repository'

class ProjectController {
  private projectService: ProjectService
  private boardService: BoardService

  constructor() {
    const boardRepository = new BoardRepository()
    const userRepository = new UserRepository()
    const groupRepository = new GroupRepository()
    const assignmentRepository = new AssignmentRepository()
    const commentRepository = new CommentRepository()
    const boardService = new BoardService(
      boardRepository, 
      userRepository, 
      groupRepository, 
      assignmentRepository, 
      commentRepository
    )

    const projectRepository = new ProjectRepository()
    const spaceRepository = new SpaceRepository()

    this.projectService = new ProjectService(
      boardRepository,
      userRepository,
      groupRepository,
      assignmentRepository,
      commentRepository,
      projectRepository,
      spaceRepository,
      boardService
    )

    this.createProject = this.createProject.bind(this)
    this.readProjects = this.readProjects.bind(this)
    this.deleteProject = this.deleteProject.bind(this)
  }

  public async createProject(req, res) {
    try {

      const title = req.query.title
      const space = req.query.space
      const sub = req.user.sub

      const project = await this.projectService.createProject(sub, title, space)
      res.send(project)

    } catch(error) {
      console.log(error)
      res.send(500)
    }
  }

  public async readProjects(req, res) {
    try {
      const sub = req.user.sub
      const projects = await this.projectService.readProjects(sub)

      res.send(projects)

    } catch(error) {
      console.log(error)
      res.send(500)
    }
  }

  public async deleteProject(req, res) {
    try {
      const id = req.query.id
      const sub = req.user.sub
      const result = await this.projectService.deleteProject(sub, id)
      if (result === true) {
        res.sendStatus(200)
      } else {
        res.sendStatus(401)
      }

    } catch(error) {
      console.log(error)
      res.send(500)
    }
  }
}

export default ProjectController