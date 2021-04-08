import ProjectRepositoryInterface from '../project-repository-interface'
import { Project }from '../../models/sequelize'
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class ProjectRepository implements ProjectRepositoryInterface {
  async create(title, space, owner) {
	  const project = await Project.create({
      title: title,
      space: space,
      owner: owner,
    })
	  return project
  }

  async find(id: string): Promise<Project> {
    const project = await Project.findById(new ObjectId(id))
    return project
  }

  async findAll(criteria): Promise<Array<Project>> {
  	const projects = await Project.find(criteria)
  	return projects
  }

  async delete(id) {
    const deleteResult = await Project.deleteOne({_id: id})
    return deleteResult
  }
}

export default ProjectRepository