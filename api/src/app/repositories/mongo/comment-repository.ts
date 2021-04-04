import CommentRepositoryInterface from '../comment-repository-interface'
import Board = require('../../models/board')
import Comment = require('../../models/comment')
import mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

class MongoCommentRepository implements CommentRepositoryInterface {

  async deleteMany(criteria) {
  	await Comment.deleteMany(criteria)
  }
}

export default MongoCommentRepository