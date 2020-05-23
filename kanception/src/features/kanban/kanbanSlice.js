import { createSlice } from '@reduxjs/toolkit';

export const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: {
    groups: [],
    boards: [],
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
      console.log(action.payload.board)
      console.log(state.boards)
      state.boards.unshift(action.payload.board)
    },
    updateBoard: (state, action) => {
      let board = state.boards.find(board => board._id === action.payload.id)
      board = Object.assign(board, action.payload.object)
      state.boards = [board, ...state.boards.filter(board => board._id !== action.payload.id)]
    },
    updateGroup: (state, action) => {
      let group = state.groups.find(group => group._id === action.payload.id)
      group = Object.assign(group, action.payload.object)
      state.groups = [group, ...state.groups.filter(group => group._id !== action.payload.id)]
    },
  },
});

export const {
  setGroups,
  setBoards,
  addGroup,
  addBoard,
  updateBoard,
  updateGroup
} = kanbanSlice.actions;

export default kanbanSlice.reducer
