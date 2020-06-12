import { createSlice } from '@reduxjs/toolkit';

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: {
    teams: [],
    selectedTeam: null,
    members: [],
  },
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload.teams
    },
    addTeam: (state, action) => {
      state.teams.unshift(action.payload.team)
    },
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload.team
    },
    setMembers: (state, action) => {
      state.members = action.payload.members
    },
  },
});

export const {
  setTeams,
  setMembers,
  addTeam,
  setSelectedTeam
} = teamsSlice.actions

export default teamsSlice.reducer
