import ProjectService from '../services/project-service'

class ProjectController {
  private projectService: ProjectService

  constructor(projectService: ProjectService) {
    this.projectService = projectService

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