import BoardRepositoryInterface from '../board-repository-interface'
import Board from '../../models/user'

class BoardRepository implements BoardRepositoryInterface {
  async find(id: string): Promise<Board> {
    const board = {
      _id: '0f0d514cf6a4dbf1f5d74b7152f440d0',
      title: '',
      description: '',
      owner: '0f0d514cf6a4dbf1f5d74b7152f440d0',
      order: '',
      project: '',
      parent: null,
      group: '',
      count: 0,
      comments: false,
    }

    return board

  }

  async findByParent(id: string): Promise<Array<Board>> {
    const boards = [{
      _id: '0f0d514cf6a4dbf1f5d74b7152f440d0',
      title: '',
      description: '',
      owner: '0f0d514cf6a4dbf1f5d74b7152f440d0',
      order: '',
      project: '',
      parent: id,
      group: '',
      count: 0,
      comments: false,
    }
    ]

    return boards
  }

  async findAll(criteria: Object): Promise<Array<Board>> {
    const boards = [{
      _id: '0f0d514cf6a4dbf1f5d74b7152f440d0',
      title: '',
      description: '',
      owner: '0f0d514cf6a4dbf1f5d74b7152f440d0',
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
      _id: '0f0d514cf6a4dbf1f5d74b7152f440d0',
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

  async merge(board, body) {
    const updatedBoard = Object.assign(board, body)
    return updatedBoard
  }

  async delete(id: string) {
    return true
  }
}

export default BoardRepository