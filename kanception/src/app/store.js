import { configureStore } from '@reduxjs/toolkit'
import kanbanReducer from '../features/kanban/kanbanSlice'
import teamsReducer from '../features/teams/teamsSlice'
import spacesReducer from '../features/spaces/spacesSlice'
import projectsReducer from '../features/projects/projectsSlice'
import assignmentsReducer from '../features/assignments/assignmentsSlice'

export default configureStore({
  reducer: {
    assignments: assignmentsReducer,
    kanban: kanbanReducer,
    teams: teamsReducer,
    spaces: spacesReducer,
    projects: projectsReducer,
  },
});
