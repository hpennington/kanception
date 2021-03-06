import { createSlice } from '@reduxjs/toolkit';

export const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: {
    groups: [],
    boards: [],
    tree: [],
  },
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(action.payload.group)
    },
    setGroups: (state, action) => {
      state.groups = action.payload.groups
    },
    setBoards: (state, action) => {
      state.boards = action.payload.boards
    },
    addBoard: (state, action) => {
      state.tree.push(action.payload.board)
    },
    setBoardTeam: (state, action) => {
      const boardRef = state.tree.find(node => node.board === action.payload.board)
      if (action.payload.team === 'Private') {
        boardRef.team = 'Private'
      } else {
        boardRef.team = action.payload.team
      }
    },
    updateBoard: (state, action) => {
      console.log(action.payload)
      let board = state.tree.find(board => board._id === action.payload.id)
      board = Object.assign(board, action.payload.object)
    },
    updateGroup: (state, action) => {
      let group = state.groups.find(group => group._id === action.payload.id)
      group = Object.assign(group, action.payload.object)
      state.groups = [group, ...state.groups.filter(group => group._id !== action.payload.id)]
      state.groups.sort((a, b) => a.order - b.order)
    },
    setTree: (state, action) => {
      state.tree = action.payload.tree
    },
    cardDelete: (state, action) => {
      state.tree = state.tree.filter(node => node._id !== action.payload.card)
    },
    groupDelete: (state, action) => {
      state.groups = state.groups.filter(group => group._id !== action.payload.group)
    },
    addAssignment: (state, action) => {
      if (state.tree.find(board => board._id === action.payload.board).assignees?.includes(action.payload.assignee) === false) {
        state.tree.find(board => board._id === action.payload.board).assignees.push(action.payload.assignee)
      }
    },
    deleteAssignment: (state, action) => {
      state.tree.find(board => board._id === action.payload.board).assignees =
        state.tree.find(board => board._id === action.payload.board).assignees?.filter(assignee => assignee !== action.payload.assignee)
    },
    addCommentIcon: (state, action) => {
      state.tree.find(board => board._id === action.payload.board).comments = true
    },
  },
});

export const {
  setGroups,
  setBoards,
  addGroup,
  addBoard,
  updateBoard,
  updateGroup,
  setTree,
  setBoardTeam,
  cardDelete,
  groupDelete,
  addAssignment,
  deleteAssignment,
  addCommentIcon,
} = kanbanSlice.actions

export default kanbanSlice.reducer
