import React, { useState, useEffect } from 'react'
import './table-view.css'

const TableCell = props => {
  console.log(props.cellId)
  return (
    <div
      className="table-cell"
      data-cell-id={props.cellId}
      onClick={props.onCellClick}
      style={{
        border: props.highlighted === true ? "solid 2px #4d27cf" : "none"
      }}
    >
      <h6
        data-cell-id={props.cellId}
      >{props.title}</h6>
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
