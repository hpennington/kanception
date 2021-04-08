import { Comment } = require('../models/sequelize')

interface CommentRepositoryInterface {
  create(owner, board, timestamp, text): Promise<Comment>;
  findAll(criteria): Promise<Array<Comment>>;
  deleteMany(criteria);
}

export default CommentRepositoryInterface