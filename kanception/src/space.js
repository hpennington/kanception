import React from 'react'
import './space.css'

const Space = props => (
  <div className="space">
    <h1>{props.title}</h1>
    <h2>Create a new board to get started</h2>
    <button
      onClick={props.onNewProject}
      className="new-project"
    >New Project</button>
  </div>
)

export default Space
