import { createSlice } from '@reduxjs/toolkit';

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    selectedProject: null,
    projects: []
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload.projects
    },
    addProject: (state, action) => {
      state.projects.push(action.payload.project)
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload.project
    },
  },
});

export const {
  setProjects,
  addProject,
  setSelectedProject,
} = projectsSlice.actions

export default projectsSlice.reducer
