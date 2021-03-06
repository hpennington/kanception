import { Project } from '../models/sequelize'

interface ProjectRepositoryInterface {
  create(title, space, owner);
  find(id: string): Promise<Project>;
  findAll(criteria): Promise<Array<Project>>;
  delete(id);
}

export default ProjectRepositoryInterface
