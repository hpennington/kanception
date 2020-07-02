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
  },
});

export const {
  setSpaces,
  addSpace,
} = spacesSlice.actions

export default spacesSlice.reducer
