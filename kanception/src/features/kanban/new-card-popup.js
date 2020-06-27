import React from 'react'
import './new-card-popup.css'

const NewCardPopup = props => {
  return (
    <div className="new-card-popup">
      <ul>
        <li>Add private card</li>
        {
          props.showAddTeamCard === true && <li>Add team card</li>
        }
      </ul>
    </div>
  )
}

export default NewCardPopup
