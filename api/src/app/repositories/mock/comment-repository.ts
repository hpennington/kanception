import CommentRepositoryInterface from '../comment-repository-interface'

class CommentRepository implements CommentRepositoryInterface {
  async create(owner, board, timestamp, text): Promise<Comment> {
      return null
  }

  async findAll(criteria): Promise<Array<Comment>> {
    return null
  }

  async deleteMany(criteria) {
  }
}

export default CommentRepository