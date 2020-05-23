import { configureStore } from '@reduxjs/toolkit'
import kanbanReducer from '../features/kanban/kanbanSlice'

export default configureStore({
  reducer: {
    kanban: kanbanReducer
  },
});
