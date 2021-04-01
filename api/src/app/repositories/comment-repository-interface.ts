import Comment = require('../models/comment')
import Board = require('../models/board')

interface CommentRepositoryInterface {
  async deleteMany(criteria);
}

export default CommentRepositoryInterface