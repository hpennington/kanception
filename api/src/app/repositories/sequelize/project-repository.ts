import ProjectRepositoryInterface from '../project-repository-interface'
import { Project }from '../../models/sequelize'
import { uuid } from 'uuidv4'

class ProjectRepository implements ProjectRepositoryInterface {
  async create(title, space, owner) {
	  const project = await Project.create({
      _id: uuid(),
      title: title,
      space: space,
      owner: owner,
    })
	  return project
  }

  async find(id: string): Promise<Project> {
    const project = await Project.findOne({where: {_id: id}})
    return project
  }

  async findAll(criteria): Promise<Array<Project>> {
  	const projects = await Project.findAll({where: criteria})
  	return projects
  }

  async delete(id) {
    const deleteResult = await Project.deleteOne({where: {_id: id}})
    return deleteResult
  }
}

export default ProjectRepository