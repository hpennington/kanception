import Project = require('../models/project')

interface ProjectRepositoryInterface {
  find(id: string): Promise<Project>;
  findAll(criteria): Promise<Array<Project>>;
}

export default ProjectRepositoryInterface