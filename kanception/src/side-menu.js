import React, { useState, useEffect } from 'react'
import TeamTableView from './team-table-view'
import InviteTableView from './invite-table-view'
import MembersView from './members-view'
import './side-menu.css'

const SideMenu = props => {
  return (
    <div id="side-menu">
      <div id="side-menu-scroll">
        <h1>Teams</h1>
        {props.invites.length > 0 &&
        <div>
          <div className="btn-container">
            <p>Team Invites</p>
          </div>
          <InviteTableView
            onTeamInviteAccept={props.onTeamInviteAccept}
            onTeamInviteDelete={props.onTeamInviteDelete}
            onSetSelectedTeam={() => {}}
            cells={props.invites}
          />
        </div>
        }
        <div className="btn-container">
          <button onClick={props.onAddTeam}>New Team</button>
        </div>
        {props.teams.length > 0 &&
        <TeamTableView
          onSetSelectedTeam={id => props.setSelectedTeam(id)}
          selectedId={props.selectedTeam}
          cells={props.teams}
        />}
        {
          props.members.length > 0 &&
          <MembersView team={props.selectedTeam} members={props.members} />
        }
      </div>
    </div>
  )
}


export default SideMenu
