import React, { useState, useEffect, useReducer } from 'react'
import { useAuth0 } from './react-auth0-spa'
import Toolbar from './toolbar'
import KanbanContainer from './features/kanban/kanban-container'
import SideMenu from './side-menu'
import { TeamTitleMenu } from './menu'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App = () => {
  const { loading, getTokenSilently } = useAuth0()
  const [mounted, setMounted] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(true)
  const [teams, setTeams] = useState([])
  const [blank, setBlank] = useState(false)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

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
    setSideMenuOpen(!sideMenuOpen)
  }

  const onAddTeam = async (e) => {
    setMenuOpen(true)
  }

  const addTeam = async (title) => {
    const api = 'http://localhost:4000'
    const teamUrl = api + '/team?title=' + title

    try {
      const token = await getTokenSilently()

      const teamResult = await fetch(teamUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const teamMember = await teamResult.json()
      teams.push(teamMember)
      console.log(teams)
      setTeams(teams)

      forceUpdate()

    } catch(error) {
      console.log(error)
    }
  }

  const onTeamSave = (title) => {
    setMenuOpen(false)
    addTeam(title)
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
      {menuOpen === true &&
      <TeamTitleMenu onSave={onTeamSave} close={() => setMenuOpen(false)} />}
      <Toolbar onBack={onBack} onOpen={onOpenMenu} />
      { sideMenuOpen === true ? <SideMenu onAddTeam={onAddTeam} teams={teams} /> : '' }
      { blank === true && <KanbanContainer
        style={{marginLeft: sideMenuOpen === true ? "375px" : 0}}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />}
    </div>
  )
}

export default App
