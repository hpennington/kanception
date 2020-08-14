import { createSlice } from '@reduxjs/toolkit';

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
  },
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload.comments
    },
    addComment: (state, action) => {
      state.comments.unshift(action.payload.comment)
    },
  },
});

export const {
  setComments,
  addComment,
} = commentsSlice.actions

export default commentsSlice.reducer
