import BoardRepositoryInterface from './board-repository-interface'
import Board = require('../models/board')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class MongoBoardRepository implements BoardRepositoryInterface {
  async find(id: string): Promise<Board> {
    const board = await Board.findById(new ObjectId(id))
    return board
  }

  async findAll(criteria): Promise<Array<Board>> {
  	const boards = await Board.find(criteria)
  	return boards
  }

  async findByParent(id: string): Promise<Array<Board>> {
    const children = await Board.find({parent: id})
    return children
  }

  async create(title, description, owner, order, project, parent, group, count, comments): Promise<Board> {
  	const board = await Board.create({
      title: title,
      description: description,
      owner: owner._id,
      order: order,
      project: project,
      parent: parent,
      group: group,
      count: count,
      comments: comments,
    })

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

export default MongoBoardRepository