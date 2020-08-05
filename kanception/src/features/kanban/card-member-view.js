import React from 'react'
import './card-member-view.css'

const CardMemberView = props => (
  <div className="card-member-view" onClick={e => {
      e.stopPropagation()
      e.preventDefault()
    }}>
    {props.text}
  </div>
)

export default CardMemberView
