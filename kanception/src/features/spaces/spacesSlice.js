import { createSlice } from '@reduxjs/toolkit';

export const spacesSlice = createSlice({
  name: 'spaces',
  initialState: {
    selectedSpace: null,
    spaces: [],
  },
  reducers: {
    setSpaces: (state, action) => {
      state.spaces = action.payload.spaces
    },
    addSpace: (state, action) => {
      state.spaces.push(action.payload.space)
    },
    deleteSpace: (state, action) => {
      state.spaces = state.spaces
        .filter(space => space._id !== action.payload.space)
    },
  },
});

export const {
  setSpaces,
  addSpace,
  deleteSpace,
} = spacesSlice.actions

export default spacesSlice.reducer
