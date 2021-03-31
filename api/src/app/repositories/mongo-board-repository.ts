import BoardRepositoryInterface from './board-repository-interface'
import Board = require('../models/board')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class MongoBoardRepository implements BoardRepositoryInterface {
  async find(id: string): Promise<Board> {
    const board = await Board.findById(new ObjectId(id))
    return board
  }
}

export default MongoBoardRepository