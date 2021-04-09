import React from 'react'
import './assignment-cell.css'

const AssignmentCell = props => (
  <div className="assignment-cell">
    <p>{props.title}</p>
    <p>Assigned by {props.assigner.firstName + ' ' + props.assigner.lastName}</p>
  </div>
)

export default AssignmentCell
