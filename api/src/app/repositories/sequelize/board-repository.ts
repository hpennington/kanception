import BoardRepositoryInterface from '../board-repository-interface'
import { Board } from '../../models/sequelize'
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

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
    const children = await Board.find({parent: id})
    return children
  }

  async create(properties): Promise<Board> {
    const board = await Board.create(properties)
    return  board
  }

  async incrementCount(board, amount) {
    await board.update({$inc: {count: amount}})
    board.save()
  }

  async merge(board, body) {
    const updatedBoard = Object.assign(board, body)
    updatedBoard.save()
    return updatedBoard
  }

  async delete(id: string) {
    const deleteResult = await Board.deleteOne({_id: new ObjectId(id)})
  }
}

export default BoardRepository