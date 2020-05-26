import React, { useState } from 'react'
import Toolbar from './toolbar'
import KanbanContainer from './features/kanban/kanban-container'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [selectedNode, setSelectedNode] = useState(null)
  const owner = '5ecc942a48c60c6051d2d9b4'

  async function onBack(e) {
    if (selectedNode !== null) {
      const api = 'http://localhost:4000'
      const treeUrl = api + '/tree?owner=' + owner

      try {
        const treeResult = await fetch(treeUrl)
        const tree = await treeResult.json()
        console.log(tree)
        const root = tree.find(node => node._id === selectedNode)
        setSelectedNode(root.parent)
      } catch(error) {
        console.log(error)
      }


    }
  }

  return (
    <div className="App">
      <Toolbar onBack={onBack}/>
      <KanbanContainer owner={owner} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
    </div>
  )
}

export default App
