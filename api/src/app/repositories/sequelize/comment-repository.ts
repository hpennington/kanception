import CommentRepositoryInterface from '../comment-repository-interface'
import Comment from '../../models/sequelize/comment'
import Board from '../../models/sequelize/board'

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