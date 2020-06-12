import { configureStore } from '@reduxjs/toolkit'
import kanbanReducer from '../features/kanban/kanbanSlice'
import teamsReducer from '../features/teams/teamsSlice'

export default configureStore({
  reducer: {
    kanban: kanbanReducer,
    teams: teamsReducer,
  },
});
