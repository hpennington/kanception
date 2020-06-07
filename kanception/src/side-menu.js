import React, { useState, useEffect } from 'react'
import TableView from './table-view'
import MembersView from './members-view'
import './side-menu.css'

const SideMenu = props => {
  const [selectedId, setSelectedId] = useState(null)
  const [teamProfiles, setTeamProfiles] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted === false) {
      if (props.teams.length > 0) {
        setMounted(true)
        setSelectedId(props.teams[0]._id)
      }
    }

    if (selectedId !== null) {
      fetchTeamProfiles()
    }
  })

  const fetchTeamProfiles = async (id) => {
    const teamMembers = await fetchTeamMembers(id)
    const teamProfiles = await fetchMemberProfiles(teamMembers)
    setTeamProfiles(teamProfiles)
  }

  const fetchTeamMembers = async (id) => {
  }

  const fetchMemberProfiles = async (teamMembers) => {
  }


  return (
    <div id="side-menu">
      <h1>Teams</h1>
      <div className="btn-container">
        <button onClick={props.onAddTeam}>New Team</button>
      </div>
      {props.teams.length > 0 &&
      <TableView
        onSetSelectedTeam={id => setSelectedId(id)}
        selectedId={selectedId}
        cells={props.teams}
      />}
      {
        props.teams.length > 0 &&
        <MembersView members={[{_id: '', name: {first: 'hayden', last: 'pennington'}}, {_id: '', name: {first: 'Josh', last: 'pennington'}}, {_id: '', name: {first: 'Graham', last: 'Pennington'}}]} />
      }
    </div>
  )
}


export default SideMenu
