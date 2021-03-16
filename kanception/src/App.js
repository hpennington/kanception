import React, { useState, useEffect, useReducer, useRef } from 'react'
import { connect } from 'react-redux'
import { themes } from './theme.js'
import { DragDropContext } from 'react-beautiful-dnd'
import GanttChart from './features/gantt/gantt.js'
import BoardsListView from './features/list-view/list-view.js'
import { setTeams, setMembers, setSelectedTeam, setNewCards } from './features/teams/teamsSlice'
import { Button } from 'react-bootstrap'
import { useAuth0 } from './react-auth0-spa'
import ThemePicker from './theme-picker'
import { setEntries } from './features/assignments/assignmentsSlice'
import {
  setGroups,
  setBoards,
  setTree,
  addGroup,
  addBoard,
  updateBoard,
  updateGroup,
} from './features/kanban/kanbanSlice'
import {
  setSpaces,
  addSpace,
  deleteSpace,
} from './features/spaces/spacesSlice'
import {
  setProjects,
  addProject,
  deleteProject,
  setSelectedProject,
  setSelectedNode,
} from './features/projects/projectsSlice'

import Space from './space'
import { removeNewCard } from './features/teams/teamsSlice'
import Toolbar from './toolbar'
import KanbanContainer from './features/kanban/kanban-container'
import SideMenu from './side-menu'
import { ProjectTitleMenu, TeamTitleMenu } from './menu'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SPACES, ASSIGNMENTS } from './constants'
import './App.css'

const App = props => {
  const { loading, getTokenSilently } = useAuth0()
  const [mounted, setMounted] = useState(false)
  const [kanbanReady, setKanbanReady] = useState(false)
  const [kanbanOpen, setKanbanOpen] = useState(true)
  const [ganttOpen, setGanttOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [prevUser, setPrevUser] = useState(null)
  const [nameOpen, setNameOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(true)
  const [tree, setTree] = useState([])
  const [teamInvites, setTeamInvites] = useState([])
  const [token, setToken] = useState(null)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [prevSelectedTeam, setPrevSelectedTeam] = useState(null)
  const [prevSelectedProject, setPrevSelectedProject] = useState(null)
  const [projectTitleMenuOpen, setProjectTitleMenuOpen] = useState(false)
  const [themePickerOpen, setThemePickerOpen] = useState(false)
  const [theme, setTheme] = useState(themes.dark)
  const [switcher, setSwitcher] = useState(SPACES)

  useEffect(() => {
    if (mounted === false) {
      setMounted(true)
      startAsyncFetching()
      const persistantTheme = window.localStorage.getItem('theme')
      if (persistantTheme === 'light') {
        setTheme(themes.light)
      }
      setThemeCSS()
    } else {
      setThemeCSS()
      if (user !== null && user !== prevUser) {
        fetchTeams(user)
        fetchTeamInvites()
        fetchSpaces()
        fetchProjects()
        setPrevUser(user)
      }

      if (props.selectedTeam !== prevSelectedTeam) {
        fetchMemberProfiles(props.selectedTeam)
        //fetchNewTeamCards(props.selectedTeam)
        setPrevSelectedTeam(props.selectedTeam)
      }

      if (props.selectedProject !== prevSelectedProject) {
        fetchTreeInit()
        setPrevSelectedProject(props.selectedProject)
      }
    }
  })

  const setThemeCSS = () => {
    document.body.style.background = theme.background
  }

  const fetchTreeInit = async () => {
    const project = props.selectedProject
    const api = process.env.REACT_APP_API
    const treeUrl = api + '/tree' + '?project=' + project

    try {
      const token = await getTokenSilently()

      const treeResult = await fetch(treeUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const tree = await treeResult.json()
      if (tree.length > 0) {
        const root = tree.find(node => node.parent == null)
        if (root != null) {
          props.dispatch(setSelectedNode({id: root._id}))
        }

      }
    } catch (error) {
      console.log(error)
    }
  }


  const fetchNewTeamCards = async (team) => {
    try {

      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/team/root/children?team=' + team

      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(res => {
          props.dispatch(setNewCards({cards: res}))
        })
        .catch(error => console.log(error))

    } catch (error) {
      console.log(error)
    }
  }

  const fetchMemberProfiles = async (team) => {
    try {

      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/profiles?team=' + team

      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(res => {
          props.dispatch(setMembers({members: res}))
        })

    } catch (error) {
      console.log(error)
    }
  }

  const teamInviteAccept = async (team) => {
    try {
      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/team/invite/accept?team=' + team

      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
          const filteredTeams = teamInvites.filter(invite => invite._id !== team)
          setTeamInvites(filteredTeams)
          user.push(team)
          setUser(user)
          fetchTeams(user)
          fetchSpaces()
          fetchProjects()
        })

    } catch (error) {
      console.log(error)
    }
  }

  const teamInviteDelete = async (team) => {
    try {
      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/teaminvites?team=' + team

      fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
          const filteredTeams = teamInvites.filter(invite => invite._id !== team)
          setTeamInvites(filteredTeams)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const startAsyncFetching = async () => {
    try {
      const token = await getTokenSilently()
      setToken(token)
      const post = await postUser()
      const res = await fetchUser()
      await fetchSpaces()
      await fetchProjects()
      await fetchTreeInit()
      setUser(res)
      setKanbanReady(true)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSpaces = async () => {
    try {

      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/spaces'

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const spaces = await result.json()
      props.dispatch(setSpaces({spaces: spaces}))
      if (spaces.length > 0) {
        props.dispatch(setSelectedTeam({team: spaces[0]._id}))
      }

    } catch(error) {
      console.log(error)
    }
  }

  const fetchProjects = async () => {
    try {

      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/projects'

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const projects = await result.json()
      props.dispatch(setProjects({projects: projects}))

      if (projects.length > 0) {
        props.dispatch(setSelectedProject({project: projects[0]._id}))
      }

    } catch(error) {
      console.log(error)
    }
  }

  const fetchTeams = async (teamIds) => {
    try {
      const token = await getTokenSilently()
      const promises = []

      for (const team of teamIds) {
        const url = process.env.REACT_APP_API + '/team?team=' + team
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
        fetchMemberProfiles(props.selectedTeam)
        //fetchNewTeamCards(props.selectedTeam)
      }

    } catch (error) {
      console.log(error)
    }

  }

  const fetchTeamInvites = async () => {
    try {

      const token = await getTokenSilently()

      const url = process.env.REACT_APP_API + '/teaminvites'

      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(res => {
          setTeamInvites(res)
        })

    } catch (error) {
      console.log(error)
    }
  }

  const fetchUser = async () => {
    try {

      const url = process.env.REACT_APP_API + '/user'
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

      const url = process.env.REACT_APP_API + '/user'
      const token = await getTokenSilently()
      const userResult = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const user = await userResult.json()

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
    if (props.tree.find(node => node._id === props.selectedNode)?.parent !== null) {
      const project = props.selectedProject
      const api = process.env.REACT_APP_API
      const treeUrl = api + '/tree?project=' + project

      try {
        const token = await getTokenSilently()

        const treeResult = await fetch(treeUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const tree = await treeResult.json()
        setTree(tree)
        const root = tree.find(node => node._id === props.selectedNode)
        props.dispatch(setSelectedNode({id: root.parent}))
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
      const api = process.env.REACT_APP_API + '/spaces/add?title=' + title
      const token = await getTokenSilently()

      const spaceResult = await fetch(api, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const space = await spaceResult.json()
      props.dispatch(addSpace({space: space}))
      props.dispatch(setSelectedTeam({team: space._id}))
      props.dispatch(setSelectedProject({project: null}))

    } catch(error) {
      console.log(error)
    }
  }

  const onAddProject = async (title, space) => {
    try {
      const api = process.env.REACT_APP_API + '/projects/add?title=' + title
        + '&space=' + space
      const token = await getTokenSilently()

      const projectResult = await fetch(api, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const project = await projectResult.json()
      console.log({project})
      props.dispatch(addProject({project: project}))

      props.dispatch(setSelectedProject({project: project._id}))

    } catch(error) {
      console.log(error)
    }
  }

  const addTeam = async (title) => {
    const api = process.env.REACT_APP_API
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

  const onSubmit = async (first, last) => {
    try {

      const url = process.env.REACT_APP_API + '/name?first='
        + first + '&last=' + last
      const token = await getTokenSilently()
      const userResult = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      setNameOpen(false)
      setThemePickerOpen(true)


    } catch(error) {
      console.log(error)
    }
  }

  const onAcceptCard = async (refId, group) => {
    try {
      const id = props.newCards.find(node => node._id === refId).board
      const parent = props.selectedNode
      const team = props.selectedTeam
      const url = process.env.REACT_APP_API + '/team/board/accept'
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
        process.env.REACT_APP_API + '/boards?ids[]=' + id, {
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

  const onSetSelectedProject = (project, team) => {
    props.dispatch(setSelectedProject({project: project}))
    props.dispatch(setSelectedTeam({team: team}))

    const node = props.tree.find(node => node.parent === null)

    if (node != null) {
      props.dispatch(setSelectedNode({id: node._id}))  
    }
    
  }

  const onDeleteProject = async id => {
    props.dispatch(deleteProject({project: id}))

    const api = process.env.REACT_APP_API

    try {
      const token = await getTokenSilently()

      const result = await fetch(api + '/project?id=' + id, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })


    } catch(error) {
      console.log(error)
    }

  }

  const onSetSelectedNode = value => {
    props.dispatch(setSelectedNode({id: value}))
  }

  const onAddProjectClick = value => {
    props.dispatch(setSelectedTeam({team: value}))
    setProjectTitleMenuOpen(true)
  }

  const onProjectSave = title => {
    setProjectTitleMenuOpen(false)
    onAddProject(title, props.selectedTeam)
  }

  const onClose = e => {
    setProjectTitleMenuOpen(false)
  }

  const onDeleteSpace = async e => {

    const selectedSpace = props.selectedTeam
    const spaceName = window.prompt('Enter space name to confirm delete')
    if (spaceName === props.spaces.find(space => space._id === selectedSpace).title) {
      props.dispatch(deleteSpace({space: props.selectedTeam}))
      if (props.spaces.filter(space => space._id !== props.selectedTeam).length > 0) {
        const space = props.spaces.filter(space => space._id !== props.selectedTeam)[0]._id
        props.dispatch(setSelectedTeam({team: space}))

      } else {
        props.dispatch(setSelectedTeam({team: null}))
        props.dispatch(setMembers({members: []}))
      }

      const api = process.env.REACT_APP_API

      try {
        const token = await getTokenSilently()

        const result = await fetch(api + '/space?id=' + selectedSpace, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })


      } catch(error) {
        console.log(error)
      }
    }

  }

  const changeThemeMode = theme => {
    setTheme(theme)
    window.localStorage.setItem('theme', theme.variant)
  }

  const onDarkModeChange = e => {
    changeThemeMode(theme.variant === 'dark' ? themes.light : themes.dark)
  }

  const onUIThemeChange = mode => {
    changeThemeMode(mode === 'light' ? themes.light : themes.dark)
  }

  const fetchAssignments = async () => {
    const api = process.env.REACT_APP_API
    const url = api + '/assignments'

    try {
      const token = await getTokenSilently()

      const result = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const assignments = await result.json()
      props.dispatch(setEntries({entries: assignments}))
    } catch(error) {
      console.log(error)
    }
  }

  if (
    props.selectedTeam == null
    && props.selectedProject === null
    && props.projects.length > 0
    && props.spaces.length > 0
  ) {
     const project = props.projects[0]
     console.log(project)
     onSetSelectedProject(project._id, project.space)
   }

  return (
    <div style={{
      height: "100%",
      "--background-color": theme.background,
      "--foreground-color": theme.foreground,
      "--text-color": theme.text,
      "--shadow-color": theme.shadow,
    }}>
      <div className="App">
        {
        projectTitleMenuOpen === true &&
        <ProjectTitleMenu
          onSave={onProjectSave}
          close={onClose}
        />
        }
        {menuOpen === true &&
        <TeamTitleMenu onSave={onTeamSave} close={() => setMenuOpen(false)} />}
        <Toolbar
          darkMode={theme.variant === 'dark'}
          onDarkModeChange={onDarkModeChange}
          onBack={onBack}
          onOpenKanban={onOpenKanban}
          onOpenGantt={onOpenGantt}
          onOpen={onOpenMenu}
          kanbanOpen={kanbanOpen === true && ganttOpen === false}
        />
        { sideMenuOpen === true &&
          <SideMenu
            theme={theme}
            setSelectedBoard={onSetSelectedNode}
            spaces={props.spaces}
            tree={props.tree}
            projects={props.projects}
            switcher={switcher}
            setSwitcher={setSwitcher}
            assignments={props.assignments}
            fetchAssignments={fetchAssignments}
            onAddProject={onAddProjectClick}
            onDeleteProject={onDeleteProject}
            projectTitleMenuOpen={projectTitleMenuOpen}
            setProjectTitleMenuOpen={setProjectTitleMenuOpen}
            setSelectedProject={onSetSelectedProject}
            onTeamInviteAccept={teamInviteAccept}
            setSelectedTeam={team => props.dispatch(setSelectedTeam({team: team}))}
            selectedTeam={props.selectedTeam}
            selectedProject={props.selectedProject}
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
              marginLeft: sideMenuOpen === true ? "300px" : 0,
              marginTop: "50px",
              width: sideMenuOpen === true ? "calc(100vw - 300px)" : "100vw",
            }}
          >
            {
            process.env.REACT_APP_GANTT_FLAG === '1'
            ?
            <GanttChart
              token={token}
              selectedNode={props.selectedNode}
            />
            :
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100% - 50px)",
            }}>
              <h1 className="coming-soon">Coming soon...</h1>
            </div>
            }
          </div>
        }
        { nameOpen === false && kanbanReady === true && kanbanOpen === true &&
          props.selectedProject != null &&
          <KanbanContainer
            fetchAssignments={fetchAssignments}
            style={{marginLeft: sideMenuOpen === true ? "300px" : 0}}
            owner={user._id}
            selectedNode={props.selectedNode}
            selectedProject={props.selectedProject}
          />
        }
        {
        props.selectedProject === null && props.selectedTeam != null &&
        <div
          style={{
            marginLeft: sideMenuOpen === true ? "300px" : 0,
            marginTop: "50px",
            width: sideMenuOpen === true ? "calc(100vw - 300px)" : "100vw",
          }}
        >
          <Space
            data-space-id={props.selectedTeam}
            onNewProject={e => setProjectTitleMenuOpen(true)}
            onDeleteSpace={onDeleteSpace}
            title={props.spaces
            .find(space => space._id === props.selectedTeam)?.title} />
        </div>
        }
        {
          nameOpen === true && <CollectInfo onSubmit={onSubmit} />
        }
        {
        themePickerOpen === true &&
        <ThemePicker
          mode={theme.variant}
          onModeChange={onUIThemeChange}
          onResign={e => setThemePickerOpen(false)}
        />
        }
      </div>
    </div>
  )
}

const CollectInfo = props => {
  const [submitEnabled, setSubmitEnabled] = useState(false)
  const firstName = useRef(null)
  const lastName = useRef(null)

  const nameStyle = {
    margin: "10px",
    borderRadius: "5px",
    border: "solid 1px gray",
  }

  const setEnabled = () => {
    if ((firstName.current.value.length > 0)
      && (lastName.current.value.length > 0)) {
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

  const onSubmit = e => {
    props.onSubmit(
      firstName.current.value,
      lastName.current.value,
    )

  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(128, 128, 128, 0.5)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      }}>
      <div style={{
        width: "300px",
        height: "200px",
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
    assignments: state.assignments.entries,
    spaces: state.spaces.spaces,
    projects: state.projects.projects,
    teams: state.teams.teams,
    selectedTeam: state.teams.selectedTeam,
    selectedProject: state.projects.selectedProject,
    selectedNode: state.projects.selectedNode,
    members: state.teams.members,
    boards: state.kanban.boards,
    newCards: state.teams.newCards,
    groups: state.kanban.groups,
    tree: state.kanban.tree,
  }
}


export default connect(mapStateToProps)(App)
