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
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p._id !== action.payload.project)
      if (state.projects.length > 0) {
        state.selectedProject = state.projects[0]._id
      }
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload.project
    },
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload.id
    },
  },
})

export const {
  setProjects,
  addProject,
  deleteProject,
  setSelectedProject,
  setSelectedNode,
} = projectsSlice.actions

export default projectsSlice.reducer
