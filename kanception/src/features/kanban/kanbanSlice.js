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
      state.boards.unshift(action.payload.board)
      state.boards.sort((a, b) => b.order - a.order)
      state.tree.push(action.payload.boardRef)
    },
    updateBoard: (state, action) => {
      console.log(action.payload)
      let board = state.boards.find(board => board._id === action.payload.id)
      board = Object.assign(board, action.payload.object)
      state.boards = [board, ...state.boards.filter(board => board._id !== action.payload.id)]
      state.boards.sort((a, b) => b.order - a.order)
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
} = kanbanSlice.actions;

export default kanbanSlice.reducer
