import { Board } = require('../models/sequelize')

interface BoardRepositoryInterface {
  find(id: string): Promise<Board>;
  findAll(criteria): Promise<Array<Board>>;
  findByParent(id: string): Promise<Array<Board>>;
  create(properties): Promise<Board>;
  incrementCount(board, amount);
  merge(board, body);
  delete(id: string);
}

export default BoardRepositoryInterface