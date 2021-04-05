import ProjectRepositoryInterface from '../project-repository-interface'
import Project = require('../../models/project')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class ProjectRepository implements ProjectRepositoryInterface {
  async find(id: string): Promise<Project> {
    const project = await Project.findById(new ObjectId(id))
    return project
  }

  async findAll(criteria): Promise<Array<Project>> {
  	const projects = await Project.find(criteria)
  	return projects
  }
}

export default ProjectRepository