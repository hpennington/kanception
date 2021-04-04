import CommentRepositoryInterface from '../comment-repository-interface'

class TestCommentRepository implements CommentRepositoryInterface {

  async deleteMany(criteria) {
  }
}

export default TestCommentRepository