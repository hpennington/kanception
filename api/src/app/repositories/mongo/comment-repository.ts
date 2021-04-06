import CommentRepositoryInterface from '../comment-repository-interface'
import Comment = require('../../models/comment')
import Board = require('../../models/board')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class CommentRepository implements CommentRepositoryInterface {
  async create(owner, board, timestamp, text): Promise<Comment> {
    const comment = await Comment.create({
      text: text,
      owner: owner,
      board: board,
      timestamp: timestamp,
    })

    return comment
  }

  async findAll(criteria): Promise<Array<Comment>> {
    const comments = await Comment.find(criteria)
    return comments
  }

  async deleteMany(criteria) {
  	await Comment.deleteMany(criteria)
  }
}

export default CommentRepository