import React from 'react'
import Toolbar from './toolbar'
import KanbanContainer from './kanban-container'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <div className="App">
      <Toolbar />
      <KanbanContainer />
    </div>
  )
}

export default App
