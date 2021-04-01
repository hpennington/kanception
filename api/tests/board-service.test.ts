import BoardService from '../src/app/services/board-service'
import TestBoardRepository from '../src/app/repositories/test-board-repository'
import TestUserRepository from '../src/app/repositories/test-user-repository'
import TestGroupRepository from '../src/app/repositories/test-group-repository'
import TestAssignmentRepository from '../src/app/repositories/test-assignment-repository'
import TestCommentRepository from '../src/app/repositories/test-comment-repository'

const project = '0f0d514cf6a4dbf1f5d74b7152f440d1'
const group = '0f0d514cf6a4dbf1f5d74b7152f440d2'
const parent = '0f0d514cf6a4dbf1f5d74b7152f440d3'
const sub = '0f0d514cf6a4dbf1f5d74b7152f440d4'

test('createBoard', async () => {
  const boardRepository = new TestBoardRepository()
  const userRepository = new TestUserRepository()
  const groupRepository = new TestGroupRepository()
  const assignmentRepository = new TestAssignmentRepository()
  const commentRepository = new TestCommentRepository()
  const boardService = new BoardService(boardRepository, userRepository, groupRepository, assignmentRepository, commentRepository)

  const board = await boardService.createBoard(project, group, parent, sub)

  expect(board.project).toBe(project)
  expect(board.group).toBe(group)
  expect(board.parent).toBe(parent)
})

test('readTree', async () => {
  const boardRepository = new TestBoardRepository()
  const userRepository = new TestUserRepository()
  const groupRepository = new TestGroupRepository()
  const assignmentRepository = new TestAssignmentRepository()
  const commentRepository = new TestCommentRepository()
  const boardService = new BoardService(boardRepository, userRepository, groupRepository, assignmentRepository, commentRepository)

  const tree = await boardService.readTree(sub, project)
  expect(tree[0]._id).toBe('0f0d514cf6a4dbf1f5d74b7152f440d0')
})

test('updateBoard', async () => {
  const boardRepository = new TestBoardRepository()
  const userRepository = new TestUserRepository()
  const groupRepository = new TestGroupRepository()
  const assignmentRepository = new TestAssignmentRepository()
  const commentRepository = new TestCommentRepository()
  const boardService = new BoardService(boardRepository, userRepository, groupRepository, assignmentRepository, commentRepository)

  const board = await boardService.createBoard(project, group, parent, sub)

  expect(board.project).toBe(project)
  expect(board.group).toBe(group)
  expect(board.parent).toBe(parent)

  const newBoard = await boardService.updateBoard(board._id, {group: 'OTHER'})
  expect(newBoard.group).toBe('OTHER')
})
