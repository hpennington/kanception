import BoardRepositoryInterface from './board-repository-interface'
import Board from '../models/user'

class TestBoardRepository implements BoardRepositoryInterface {
  async find(id: string): Promise<Board> {
    const board = {
      _id: 'TEST_ID',
      title: '',
      description: '',
      owner: '0f0d514cf6a4dbf1f5d74b7152f440d4',
      order: '',
      project: '',
      parent: null,
      group: '',
      count: 0,
      comments: false,
    }

    return board

  }

  async findAll(criteria: Object): Promise<Array<Board>> {
    const boards = [{
      _id: 'TEST_ID',
      title: '',
      description: '',
      owner: '0f0d514cf6a4dbf1f5d74b7152f440d4',
      order: '',
      project: '',
      parent: null,
      group: '',
      count: 0,
      comments: false,
    }]

    return boards
  }

  async create(title, description, owner, order, project, parent, group, count, comments): Promise<Board> {
    const board = {
      _id: 'TEST_ID',
      title: title,
      description: description,
      owner: owner._id,
      order: order,
      project: project,
      parent: parent,
      group: group,
      count: count,
      comments: comments,
    }

    return board
  }

  async incrementCount(board, amount) {
  }
}

export default TestBoardRepository