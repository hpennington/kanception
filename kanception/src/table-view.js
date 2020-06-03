import React from 'react'
import './table-view.css'

const TableCell = props => {
  return (
    <div className="table-cell"
      style={{
        border: props.highlighted === true ? "solid 2px #4d27cf" : "none"
      }}
    >
      <h6>{props.title}</h6>
    </div>
  )
}

const TableView  = props => {
  console.log(props.cells)
  return (
    <div className="table-view">
      {props.cells.map(cell => <TableCell title={cell.title} highlighted={cell.selected} />)}
    </div>
  )
}

export default TableView
