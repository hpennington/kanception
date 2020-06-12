import { createSlice } from '@reduxjs/toolkit';

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: {
    teams: [],
    selectedTeam: null,
    members: [],
    newCards: [],
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
    setNewCards: (state, action) => {
      state.newCards = action.payload.cards
    },
  },
});

export const {
  setTeams,
  setMembers,
  addTeam,
  setSelectedTeam,
  setNewCards
} = teamsSlice.actions

export default teamsSlice.reducer
