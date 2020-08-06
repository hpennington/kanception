import { createSlice } from '@reduxjs/toolkit';

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    entries: [],
  },
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload.entries
    },
    addAssignment2: (state, action) => {
      state.entries.push(action.payload.entries)
    },
    deleteAssignment2: (state, action) => {
      state.entries = state.entries
        .filter(entry => entry.board === action.payload.board
          && entry.assignee === action.payload.assignee
        )
    },
  },
});

export const {
  setEntries,
  addAssignment2,
  deleteAssignment2,
} = assignmentsSlice.actions

export default assignmentsSlice.reducer
