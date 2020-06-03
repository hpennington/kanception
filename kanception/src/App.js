import React, { useState, useEffect } from 'react'
import { useAuth0 } from './react-auth0-spa'
import Toolbar from './toolbar'
import KanbanContainer from './features/kanban/kanban-container'
import SideMenu from './side-menu'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App = () => {
  const { loading, getTokenSilently } = useAuth0()
  const [mounted, setMounted] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [menuOpen, setMenuOpen] = useState(true)
  const [teams, setTeams] = useState([])
  const [blank, setBlank] = useState(false)

  useEffect(() => {
    if (mounted === false) {
      setMounted(true)
      postAndFetchUser()
    }
  })

  const postAndFetchUser = async () => {
    try {
      const post = await postUser()
      const res = await fetchUser()
      fetchTeams(res)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTeams = async (teamIds) => {
    try {
      const token = await getTokenSilently()
      console.log(teams)

      for (const team of teamIds) {
        const url = 'http://localhost:4000/team?team=' + team
        fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(res => res.json())
          .then(res => {
            const newTeams = teams
            console.log(res)
            newTeams.push(res)
            setTeams(newTeams)
          })
      }
    } catch (error) {
      console.log(error)
    }

  }

  const fetchUser = async () => {
    try {

      const url = 'http://localhost:4000/user'
      const token = await getTokenSilently()
      const userResult = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const user = await userResult.json()
      return user
      console.log(user.teams)

    } catch(error) {
      console.log(error)
    }
  }

  const postUser = async () => {
    try {

      const url = 'http://localhost:4000/user'
      const token = await getTokenSilently()
      const userResult = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const userId = await userResult.json()
      console.log(userId)
      setBlank(true)

    } catch(error) {
      console.log(error)
    }
  }

  const onBack = async (e) => {
    if (selectedNode !== null) {
      const api = 'http://localhost:4000'
      const treeUrl = api + '/tree'

      try {
        const token = await getTokenSilently()

        const treeResult = await fetch(treeUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

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
    setMenuOpen(!menuOpen)
  }

  const onAddTeam = async (e) => {
    const api = 'http://localhost:4000'
    const treeUrl = api + '/team?title=bob'

    try {
      const token = await getTokenSilently()

      const treeResult = await fetch(treeUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

    } catch(error) {
      console.log(error)
    }
  }

  if (loading === true) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="App">
      <Toolbar onBack={onBack} onOpen={onOpenMenu} />
      { menuOpen === true ? <SideMenu onAddTeam={onAddTeam} teams={teams} /> : '' }
      { blank === true && <KanbanContainer
        style={{marginLeft: menuOpen === true ? "375px" : 0}}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />}
    </div>
  )
}

export default App
