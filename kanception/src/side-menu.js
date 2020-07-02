import React, { useState, useEffect } from 'react'
import TeamTableView from './team-table-view'
import NewCardsTableView from './new-cards-table-view'
import InviteTableView from './invite-table-view'
import MembersView from './members-view'
import TreeView from './tree-view'
import './side-menu.css'

const SideMenu = props => {
  return (
    <div id="side-menu">
      <div id="side-menu-scroll">
        <h1>Spaces</h1>
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
          <button onClick={props.onAddTeam}>New Space +</button>
        </div>
        {props.spaces.length > 0 &&
        <TreeView
          spaces={props.spaces}
          projects={props.projects}
          onAddProject={props.onAddProject}
          setSelectedProject={props.setSelectedProject}
        />
        }
        {
          props.newCards.length > 0 &&
          <span>
            <div className="btn-container">
              <p>New shared team cards</p>
            </div>
            <NewCardsTableView
              onAcceptCard={props.onAcceptCard}
              groups={props.groups}
              cells={props.newCards}
            />
          </span>
        }
        {
          props.members.length > 0 &&
          <MembersView team={props.selectedTeam} members={props.members} />
        }
      </div>
    </div>
  )
}


export default SideMenu
