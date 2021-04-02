import Board = require('../models/board')

interface BoardRepositoryInterface {
  find(id: string): Promise<Board>;
  findAll(criteria): Promise<Array<Board>>;
  findByParent(id: string): Promise<Array<Board>>;
  create(title, description, owner, order, project, parent, group, count, comments): Promise<Board>;
  incrementCount(board, amount);
  merge(board, body);
  delete(id: string);
}

export default BoardRepositoryInterface