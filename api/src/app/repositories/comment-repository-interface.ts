import Comment = require('../models/comment')
import Board = require('../models/board')

interface CommentRepositoryInterface {
  deleteMany(criteria);
}

export default CommentRepositoryInterface