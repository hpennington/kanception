import React, { useState, useEffect, useReducer, useRef } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import GanttChart from './features/gantt/gantt.js'
import BoardsListView from './features/list-view/list-view.js'
import { setTeams, setMembers, setSelectedTeam, setNewCards } from './features/teams/teamsSlice'
import { Button } from 'react-bootstrap'
import { useAuth0 } from './react-auth0-spa'
import {
  setGroups,
  setBoards,
  addGroup,
  addBoard,
  updateBoard,
  updateGroup,
} from './features/kanban/kanbanSlice'
import {
  setSpaces,
  addSpace,
} from './features/spaces/spacesSlice'
import {
  setProjects,
  addProject,
} from './features/projects/projectsSlice'
import { removeNewCard } from './features/teams/teamsSlice'
import Toolbar from './toolbar'
import KanbanContainer from './features/kanban/kanban-container'
import SideMenu from './side-menu'
import { TeamTitleMenu } from './menu'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App = props => {
  const { loading, getTokenSilently } = useAuth0()
  const [mounted, setMounted] = useState(false)
  const [kanbanReady, setKanbanReady] = useState(false)
  const [kanbanOpen, setKanbanOpen] = useState(true)
  const [ganttOpen, setGanttOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [prevUser, setPrevUser] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [nameOpen, setNameOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(true)
  const [tree, setTree] = useState([])
  const [teamInvites, setTeamInvites] = useState([])
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [prevSelectedTeam, setPrevSelectedTeam] = useState(null)

  useEffect(() => {
    if (mounted === false) {
      setMounted(true)
      startAsyncFetching()
    } else {
      if (user !== null && user !== prevUser) {
        fetchTeams(user)
        fetchTeamInvites()
        fetchSpaces()
        fetchProjects()
        setPrevUser(user)
      }

      if (props.selectedTeam !== prevSelectedTeam) {
        fetchMemberProfiles(props.selectedTeam)
        fetchNewTeamCards(props.selectedTeam)
        setPrevSelectedTeam(props.selectedTeam)
      }
    }
  })

  const fetchTreeInit = async () => {
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
      //props.dispatch(setTree({tree: tree}))

      const root = tree.find(node => node.isUserRoot === true)
      console.log(root)
      setSelectedNode(root._id)

    } catch (error) {
      console.log(error)
    }
  }


  const fetchNewTeamCards = async (team) => {
    try {

      const token = await getTokenSilently()
      const url = 'http://localhost:4000/team/root/children?team=' + team

      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(res => {
          console.log(res)
          props.dispatch(setNewCards({cards: res}))
        })
        .catch(error => console.log(error))

    } catch (error) {
      console.log(error)
    }
  }

  const fetchMemberProfiles = async (team) => {
    console.log('fetchMemberProfiles')
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
          props.dispatch(setMembers({members: res}))
        })

    } catch (error) {
      console.log(error)
    }
  }

  const teamInviteAccept = async (team) => {
    try {
      const token = await getTokenSilently()
      const url = 'http://localhost:4000/team/invite/accept?team=' + team

      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
          console.log(res)
          const filteredTeams = teamInvites.filter(invite => invite._id !== team)
          console.log(filteredTeams)
          setTeamInvites(filteredTeams)
          user.push(team)
          setUser(user)
          fetchTeams(user)
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

  const startAsyncFetching = async () => {
    try {
      const post = await postUser()
      const res = await fetchUser()
      await fetchSpaces()
      await fetchProjects()
      setUser(res)
      setKanbanReady(true)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSpaces = async () => {
    try {

      const token = await getTokenSilently()
      const url = 'http://localhost:4000/spaces'

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const spaces = await result.json()
      props.dispatch(setSpaces({spaces: spaces}))

    } catch(error) {
      console.log(error)
    }
  }

  const fetchProjects = async () => {
    try {

      const token = await getTokenSilently()
      const url = 'http://localhost:4000/projects'

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const projects = await result.json()
      props.dispatch(setProjects({projects: projects}))

    } catch(error) {
      console.log(error)
    }
  }

  const fetchTeams = async (teamIds) => {
    try {
      const token = await getTokenSilently()
      const promises = []

      for (const team of teamIds) {
        const url = 'http://localhost:4000/team?team=' + team
        const promise = new Promise(async (resolve, reject) => {
          try {
            const res = await fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            const json = await res.json()
            resolve(json)
          } catch(error) {
            reject(error)
          }
        })

        promises.push(promise)
      }

      const results = await Promise.all(promises)

      props.dispatch(setTeams({teams: results}))

      if (results.length > 0) {
        props.dispatch(setSelectedTeam({team: results[0]._id}))
        fetchMemberProfiles(props.selectedTeam)
        fetchNewTeamCards(props.selectedTeam)
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
        setTree(tree)
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

  const onAddSpace = async (title) => {
    try {
      const api = 'http://localhost:4000/spaces/add?title=' + title
      const token = await getTokenSilently()

      const spaceResult = await fetch(api, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const space = await spaceResult.json()
      props.dispatch(addSpace({space: space}))

    } catch(error) {
      console.log(error)
    }
  }

  const onAddProject = async (title, space) => {
    try {
      const api = 'http://localhost:4000/projects/add?title=' + title
        + '&space=' + space
      const token = await getTokenSilently()

      const projectResult = await fetch(api, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const project = await projectResult.json()
      props.dispatch(addProject({project: project}))

    } catch(error) {
      console.log(error)
    }
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
      const newTeams = props.teams.slice()
      newTeams.unshift(teamMember)
      console.log(newTeams)
      props.dispatch(setTeams({teams: newTeams}))

      if (newTeams.length > 0) {
        props.dispatch(setSelectedTeam({team: newTeams[0]._id}))
      }

      forceUpdate()

    } catch(error) {
      console.log(error)
    }
  }

  const onTeamSave = (title) => {
    setMenuOpen(false)
    onAddSpace(title)
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

  const onAcceptCard = async (refId, group) => {
    try {
      const id = props.newCards.find(node => node._id === refId).board
      const parent = selectedNode
      const team = props.selectedTeam
      const url = 'http://localhost:4000/team/board/accept'
        + '?board=' + id
        + '&group=' + group
        + '&parent=' + parent
        + '&team=' + team

      const token = await getTokenSilently()
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const boardRef = await result.json()

      const boardResult = await fetch(
        'http://localhost:4000/boards?ids[]=' + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const boards = await boardResult.json()
      props.dispatch(addBoard({board: boards[0], boardRef: boardRef}))
      props.dispatch(removeNewCard({id: id}))

    } catch(error) {
      console.log(error)
    }

  }

  const onOpenKanban = e => {
    setKanbanOpen(true)
    setGanttOpen(false)
  }

  const onOpenGantt = e => {
    setGanttOpen(true)
    setKanbanOpen(false)
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
        <Toolbar
          onBack={onBack}
          onOpenKanban={onOpenKanban}
          onOpenGantt={onOpenGantt}
          onOpen={onOpenMenu}
          kanbanOpen={kanbanOpen === true && ganttOpen === false}
        />
        { sideMenuOpen === true &&
          <SideMenu
            spaces={props.spaces}
            projects={props.projects}
            onAddProject={onAddProject}
            onTeamInviteAccept={teamInviteAccept}
            setSelectedTeam={team => props.dispatch(setSelectedTeam({team: team}))}
            selectedTeam={props.selectedTeam}
            onTeamInviteDelete={teamInviteDelete}
            onAddTeam={onAddTeam}
            invites={teamInvites}
            groups={props.groups}
            onAcceptCard={onAcceptCard}
            boards={props.boards}
            newCards={props.boards.length > 0
              ? props.newCards
              .filter(card => card.team === props.selectedTeam)
              .filter(card => !props.tree
                .map(boardRef => boardRef.board).includes(card.board)
              )
              : []}
            teams={props.teams}
            members={props.members}
          />
        }
        {
          ganttOpen === true &&
          <div
            style={{
              marginLeft: sideMenuOpen === true ? "375px" : 0,
              marginTop: "50px",
              width: sideMenuOpen === true ? "calc(100vw - 375px)" : "100vw",
              overflow: "auto",
            }}
          >
            <DragDropContext>
              <GanttChart />
              <BoardsListView />
            </DragDropContext>
          </div>
        }
        { nameOpen === false && kanbanReady === true && kanbanOpen === true &&
          selectedNode != null &&
          <KanbanContainer
            style={{marginLeft: sideMenuOpen === true ? "375px" : 0}}
            owner={user._id}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        }
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

const mapStateToProps = state => {
  return {
    spaces: state.spaces.spaces,
    projects: state.projects.projects,
    teams: state.teams.teams,
    selectedTeam: state.teams.selectedTeam,
    members: state.teams.members,
    boards: state.kanban.boards,
    newCards: state.teams.newCards,
    groups: state.kanban.groups,
    tree: state.kanban.tree,
  }
}


export default connect(mapStateToProps)(App)
