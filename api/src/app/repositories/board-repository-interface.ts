import Board = require('../models/board')

interface BoardRepositoryInterface {
  async find(id: string): Promise<Board>;
  async findAll(criteria): Promise<Array<Board>>;
  async create(title, description, owner, order, project, parent, group, count, comments): Promise<Board>;
  async incrementCount(board, amount);
}

export default BoardRepositoryInterface