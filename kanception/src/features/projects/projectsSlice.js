import { createSlice } from '@reduxjs/toolkit';

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    selectedProject: null,
    selectedNode: null,
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
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload.id
    },
  },
});

export const {
  setProjects,
  addProject,
  setSelectedProject,
  setSelectedNode,
} = projectsSlice.actions

export default projectsSlice.reducer
