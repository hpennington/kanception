import React from 'react'
import CardMemberView from './features/kanban/card-member-view'
import './assignment-list.css'

const AssignmentList = props => (
  <div className="assignment-list-overlay">
    <div className="assignment-list">
      <h5>Assign to</h5>
      <table>
        <tbody>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
          <tr>
            <AssignmentListCell />
          </tr>
        </tbody>
      </table>
      <button onClick={props.onClose} className="close-assignment-list">Close</button>
    </div>
  </div>
)

const AssignmentListCell = props => (
  <div className="assignment-list-cell">
    <CardMemberView />
    <div className="name-container">
      <p>Hayden Travis Pennington</p>
      <p>haydenpennington@ecomseating.com</p>
    </div>
    <input type="checkbox" />
  </div>
)

export default AssignmentList
