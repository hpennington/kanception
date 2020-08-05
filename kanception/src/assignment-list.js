import React from 'react'
import CardMemberView from './features/kanban/card-member-view'
import './assignment-list.css'

const AssignmentList = props => (
  <div className="assignment-list-overlay">
    <div className="assignment-list">
      <h5>Assign to</h5>
      <table>
        <tbody>
          {
          props.members.map(member =>
            <tr>
              <AssignmentListCell name={member.name} email={member.email} />
            </tr>
          )
          }
        </tbody>
      </table>
      <button onClick={props.onClose} className="close-assignment-list">Close</button>
    </div>
  </div>
)

const AssignmentListCell = props => (
  <div className="assignment-list-cell">
    <CardMemberView text={props.name.first.slice(0, 1).toUpperCase() + props.name.last.slice(0, 1).toUpperCase()} />
    <div className="name-container">
      <p>{props.name.first + " " + props.name.last}</p>
      <p>{props.email}</p>
    </div>
    <input type="checkbox" />
  </div>
)

export default AssignmentList
