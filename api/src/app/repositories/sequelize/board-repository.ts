import BoardRepositoryInterface from '../board-repository-interface'
import { Board } from '../../models/sequelize'

class BoardRepository implements BoardRepositoryInterface {
  async find(id: string): Promise<Board> {
    const board = await Board.findOne({where: {_id: id}})
    return board
  }

  async findAll(criteria): Promise<Array<Board>> {
  	const boards = await Board.findAll({where: criteria})
  	return boards
  }

  async findByParent(id: string): Promise<Array<Board>> {
    const children = await Board.findAll({where: {parent: id}})
    return children
  }

  async create(properties): Promise<Board> {
    const board = await Board.create(properties)
    return  board
  }

  async incrementCount(board, amount) {
    await board.increment('count', {by: amount})
    await board.save()
  }

  async merge(board, body) {
    const updatedBoard = Object.assign(board, body)
    await updatedBoard.save()
    return updatedBoard
  }

  async delete(id: string) {
    const deleteResult = await Board.destroy({where: {_id: id}})
  }
}

export default BoardRepository