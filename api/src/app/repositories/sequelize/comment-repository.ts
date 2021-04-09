import { uuid } from 'uuidv4'
import CommentRepositoryInterface from '../comment-repository-interface'
import { Comment } from '../../models/sequelize'
import { Board } from '../../models/sequelize'

class CommentRepository implements CommentRepositoryInterface {
  async create(owner, board, timestamp, text): Promise<Comment> {
    const _id = uuid()
    const comment = await Comment.create({
      _id: _id,
      text: text,
      owner: owner,
      board: board,
      timestamp: timestamp,
    })

    return comment
  }

  async findAll(criteria): Promise<Array<Comment>> {
    const comments = await Comment.findAll({where: criteria})
    return comments
  }

  async deleteMany(criteria) {
  	await Comment.destroy({where: criteria})
  }
}

export default CommentRepository