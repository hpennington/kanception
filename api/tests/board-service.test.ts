import BoardService from '../src/app/services/board-service'
import BoardRepository from '../src/app/repositories/mock/board-repository'
import UserRepository from '../src/app/repositories/mock/user-repository'
import GroupRepository from '../src/app/repositories/mock/group-repository'
import AssignmentRepository from '../src/app/repositories/mock/assignment-repository'
import CommentRepository from '../src/app/repositories/mock/comment-repository'

// const project = '0f0d514cf6a4dbf1f5d74b7152f440d1'
// const group = '0f0d514cf6a4dbf1f5d74b7152f440d2'
// const parent = '0f0d514cf6a4dbf1f5d74b7152f440d3'
// const sub = '0f0d514cf6a4dbf1f5d74b7152f440d4'

// const boardRepository = new BoardRepository()
// const userRepository = new UserRepository()
// const groupRepository = new GroupRepository()
// const assignmentRepository = new AssignmentRepository()
// const commentRepository = new CommentRepository()
// const boardService = new BoardService(boardRepository, userRepository, groupRepository, assignmentRepository, commentRepository)

// test('createBoard', async () => {
//   const board = await boardService.createBoard({project, group, parent, sub})

//   expect(board.project).toBe(project)
//   expect(board.group).toBe(group)
//   expect(board.parent).toBe(parent)
// })

// test('readTree', async () => {
//   const tree = await boardService.readTree(sub, project)
//   expect(tree[0]._id).toBe('0f0d514cf6a4dbf1f5d74b7152f440d0')
// })

// test('updateBoard', async () => {
//   const board = await boardService.createBoard({project, group, parent, sub})

//   expect(board.project).toBe(project)
//   expect(board.group).toBe(group)
//   expect(board.parent).toBe(parent)

//   const newBoard = await boardService.updateBoard(board._id, {group: 'OTHER'})
//   expect(newBoard.group).toBe('OTHER')
// })
