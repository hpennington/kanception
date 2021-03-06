import React, { useState, useEffect } from 'react'
import './table-view.css'

const TableCell = props => {
  console.log(props.cellId)
  return (
    <div
      className="table-cell table-cell-invite"
      data-cell-id={props.cellId}
      onClick={props.onCellClick}
      style={{
        border: props.highlighted === true ? "solid 2px #4d27cf" : "none",
      }}
    >
      <button style={{
        margin: "10px",
        width: "50px",
        height: "30px",
        borderRadius: "10px",
        fontSize: "0.5em",
        background: "#A00",
        color: "white",
        border: "none",
        }}
        onClick={e => props.onTeamInviteDelete(props.cellId)}
      >
        Decline
      </button>
      <h6
        data-cell-id={props.cellId}
      >{props.title}</h6>
      <button style={{
        margin: "10px",
        borderRadius: "10px",
        width: "50px",
        height: "30px",
        fontSize: "0.5em",
        background: "#4d27cf",
        color: "white",
        border: "none",
        }}
        onClick={e => props.onTeamInviteAccept(props.cellId)}
      >
        Accept
      </button>
    </div>
  )
}

const TableView  = props => {
  const onCellClick = e => {
    props.onSetSelectedTeam(e.target.dataset.cellId)
  }

  return (
    <div className="table-view">
      {
      props.cells
      .map(cell => (
      {_id: cell._id, title: cell.title,
      highlighted: cell._id === props.selectedId})
      )
      .map(cell =>
        <TableCell
          onTeamInviteAccept={props.onTeamInviteAccept}
          onTeamInviteDelete={props.onTeamInviteDelete}
          cellId={cell._id}
          onCellClick={onCellClick}
          title={cell.title}
          highlighted={cell.highlighted}
        />
       )
      }
    </div>
  )
}

export default TableView
