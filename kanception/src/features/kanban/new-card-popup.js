import React from 'react'
import './new-card-popup.css'

const NewCardPopup = props => {
  return (
    <div className="new-card-popup">
      <ul>
        <li data-group-id={props.id} onClick={props.onAddPrivateCard}>Add private card</li>
        {
        props.showAddTeamCard === true &&
        <li data-group-id={props.id} onClick={props.onAddTeamCard}>Add team card</li>
        }
      </ul>
    </div>
  )
}

export default NewCardPopup
