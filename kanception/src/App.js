import React, { useState } from 'react'
import Toolbar from './toolbar'
import KanbanContainer from './features/kanban/kanban-container'
import SideMenu from './side-menu'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [menuOpen, setMenuOpen] = useState(true)
  const owner = '5ed1cf5fd373ad3988a43a65'

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

  const onOpenMenu = (e) => {
    console.log(e)
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="App">
      <Toolbar onBack={onBack} onOpen={onOpenMenu} />
      { menuOpen === true ? <SideMenu /> : '' }
      <KanbanContainer
        style={{marginLeft: menuOpen === true ? "375px" : 0}}
        owner={owner}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    </div>
  )
}

export default App
