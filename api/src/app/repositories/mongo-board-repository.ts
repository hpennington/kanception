const Board = require('../models/board')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class MongoBoardRepository: BoardRepositoryInterface {
  async find(id: string) {
    const board = await Board.findById(new ObjectId(id))
    return board
  }
}