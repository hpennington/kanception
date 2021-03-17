import React from 'react'
import './space.css'

const Space = props => (
  <div className="space">
    <div className="btn-container">
      <button
        onClick={props.onNewProject}
        className="new-project"
      >New Project</button>
      <button
        onClick={props.onDeleteSpace}
        className="delete-space"
      >Delete Space</button>
    </div>
    <h1>{props.title}</h1>
    <h2>Create a new project to get started</h2>
  </div>
)

export default Space
