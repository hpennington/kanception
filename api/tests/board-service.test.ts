const BoardService = require('../src/app/services/board-service')
import TestBoardRepository from '../src/app/repositories/test-board-repository'
import TestUserRepository from '../src/app/repositories/test-user-repository'
import TestGroupRepository from '../src/app/repositories/test-group-repository'
import MongoAssignmentRepository from '../src/app/repositories/mongo-assignment-repository'

test('createBoard', async () => {
  const boardRepository = new TestBoardRepository()
  const userRepository = new TestUserRepository()
  const groupRepository = new TestGroupRepository()
  const assignmentRepository = new MongoAssignmentRepository()
  const boardService = new BoardService(boardRepository, userRepository, groupRepository, assignmentRepository)

  const project = '0f0d514cf6a4dbf1f5d74b7152f440d1'
  const group = '0f0d514cf6a4dbf1f5d74b7152f440d2'
  const parent = '0f0d514cf6a4dbf1f5d74b7152f440d3'
  const sub = '0f0d514cf6a4dbf1f5d74b7152f440d4'

  const board = await boardService.createBoard(project, group, parent, sub)

  expect(board.project).toBe(project)
  expect(board.group).toBe(group)
  expect(board.parent).toBe(parent)
})