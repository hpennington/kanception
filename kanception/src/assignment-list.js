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
              <AssignmentListCell
                checked={props.assignees && props.assignees.includes(member._id)}
                userId={member._id}
                name={{first: member.firstName, last: member.lastName}}
                email={member.email}
                onAddAssignment={props.onAddAssignment}
                onDeleteAssignment={props.onDeleteAssignment}
              />
            </tr>
          )
          }
        </tbody>
      </table>
      <button onClick={props.onClose} className="close-assignment-list">Close</button>
    </div>
  </div>
)

const AssignmentListCell = props => {
  const onChange = e => {
    if (e.target.checked === true) {
      props.onAddAssignment(e.target.dataset.userId)
    } else {
      props.onDeleteAssignment(e.target.dataset.userId)
    }
  }

  return (
    <div className="assignment-list-cell">
      <input
        checked={props.checked}
        onChange={onChange}
        data-user-id={props.userId}
        type="checkbox"
      />
      <CardMemberView text={props.name.first.slice(0, 1).toUpperCase() + props.name.last.slice(0, 1).toUpperCase()} />
      <div className="name-container">
        <p>{props.name.first + " " + props.name.last}</p>
        <p>{props.email}</p>
      </div>
    </div>
  )
}

export default AssignmentList
