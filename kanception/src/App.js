import React, { useState, useEffect, useReducer, useRef } from 'react'
import { Button } from 'react-bootstrap'
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
  const [kanbanReady, setKanbanReady] = useState(false)
  const [user, setUser] = useState(null)
  const [prevUser, setPrevUser] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [nameOpen, setNameOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(true)
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [teamInvites, setTeamInvites] = useState([])
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [prevSelectedTeam, setPrevSelectedTeam] = useState(null)

  useEffect(() => {
    if (mounted === false) {
      setMounted(true)
      postAndFetchUser()
    } else {
      if (user !== null && user !== prevUser) {
        fetchTeams(user)
        fetchTeamInvites()
        setPrevUser(user)
      }

      if (selectedTeam !== prevSelectedTeam) {
        fetchMemberProfiles(selectedTeam)
        setPrevSelectedTeam(selectedTeam)
      }
    }
  })

  const fetchMemberProfiles = async (team) => {
    try {

      const token = await getTokenSilently()
      const url = 'http://localhost:4000/profiles?team=' + team

      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(res => {
          console.log(res)
        })

    } catch (error) {
      console.log(error)
    }
  }

  const teamInviteDelete = async (team) => {
    try {
      const token = await getTokenSilently()
      const url = 'http://localhost:4000/teaminvites?team=' + team

      fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
          console.log(res)
          const filteredTeams = teamInvites.filter(invite => invite._id !== team)
          console.log(filteredTeams)
          setTeamInvites(filteredTeams)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const postAndFetchUser = async () => {
    try {
      const post = await postUser()
      const res = await fetchUser()
      setUser(res)
      setKanbanReady(true)
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
            console.log(res)
            console.log(teams)
            if (teams.find(team => team._id === res._id) === undefined) {
              const newTeams = teams
              console.log(res)
              newTeams.push(res)
              setTeams(newTeams)
              if (newTeams.length > 0) {
                setSelectedTeam(newTeams[0]._id)
              }
            }
          })
      }
    } catch (error) {
      console.log(error)
    }

  }

  const fetchTeamInvites = async () => {
    try {

      const token = await getTokenSilently()

      const url = 'http://localhost:4000/teaminvites'

      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(res => {
          console.log(res)
          setTeamInvites(res)
        })

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

      const user = await userResult.json()
      console.log(user)

      if (user.name === undefined) {
        setNameOpen(true)
      } else {
        setNameOpen(false)
      }

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

  const onSubmit = async (first, last, email) => {
    try {

      const url = 'http://localhost:4000/name?first='
        + first + '&last=' + last + '&email=' + email
      const token = await getTokenSilently()
      const userResult = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      setNameOpen(false)

      console.log(userResult)

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
      {menuOpen === true &&
      <TeamTitleMenu onSave={onTeamSave} close={() => setMenuOpen(false)} />}
      <Toolbar onBack={onBack} onOpen={onOpenMenu} />
      { sideMenuOpen === true ? <SideMenu setSelectedTeam={setSelectedTeam} selectedTeam={selectedTeam} onTeamInviteDelete={teamInviteDelete} onAddTeam={onAddTeam} invites={teamInvites} teams={teams} members={members}/> : '' }
      { nameOpen === false && kanbanReady === true && <KanbanContainer
        style={{marginLeft: sideMenuOpen === true ? "375px" : 0}}
        owner={user._id}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />}
      {
        nameOpen === true && <CollectInfo onSubmit={onSubmit} />
      }
    </div>
  )
}

const CollectInfo = props => {
  const [submitEnabled, setSubmitEnabled] = useState(false)
  const firstName = useRef(null)
  const lastName = useRef(null)
  const email = useRef(null)

  const nameStyle = {
    margin: "10px",
    borderRadius: "5px",
    border: "solid 1px gray",
  }

  const setEnabled = () => {
    if ((firstName.current.value.length > 0)
      && (lastName.current.value.length > 0)
      && (email.current.value.length > 0)) {
      setSubmitEnabled(true)
    } else {
      setSubmitEnabled(false)
    }
  }

  const onFirstChange = e => {
    setEnabled()
  }

  const onLastChange = e => {
    setEnabled()
  }

  const onEmailChange = e => {
    setEnabled()
  }

  const onSubmit = e => {
    props.onSubmit(
      firstName.current.value,
      lastName.current.value,
      email.current.value,
    )
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(128, 128, 128, 0.25)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      }}>
      <div style={{
        width: "300px",
        height: "300px",
        background: "white",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        }}>
        <p>Enter your name!</p>
        <input
          ref={firstName}
          type="text"
          onChange={onFirstChange}
          placeholder="First"
          style={nameStyle}
        />
        <input
          ref={lastName}
          type="text"
          onChange={onLastChange}
          placeholder="Last"
          style={nameStyle}
        />
        <input
          ref={email}
          type="email"
          onChange={onEmailChange}
          placeholder="Email"
          style={nameStyle}
        />
        <Button
          onClick={onSubmit}
          disabled={!submitEnabled}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default App
