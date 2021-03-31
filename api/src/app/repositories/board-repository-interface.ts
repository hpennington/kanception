import Board = require('../models/board')

interface BoardRepositoryInterface {
  async find(id: string): Promise<Board>;
}

export default BoardRepositoryInterface