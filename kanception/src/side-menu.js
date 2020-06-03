import React from 'react'
import TableView from './table-view'
import './side-menu.css'

const SideMenu = props => {
  return (
    <div id="side-menu">
      <h1>Teams</h1>
      <div className="btn-container">
        <button onClick={props.onAddTeam}>Add Team</button>
      </div>
      <TableView cells={props.teams} />
    </div>
  )
}

export default SideMenu
