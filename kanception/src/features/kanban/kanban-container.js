import React, {
  useEffect, useState, useRef, forwardRef, useImperativeHandle
} from 'react'
import { connect } from 'react-redux'
import Kanban from './kanban'
import { setSelectedNode } from '../projects/projectsSlice'
import { addAssignment2, deleteAssignment2 } from '../assignments/assignmentsSlice'
import { addComment } from '../comments/commentsSlice'
import {
  setGroups,
  setBoards,
  addGroup,
  addBoard,
  cardDelete,
  groupDelete,
  updateBoard,
  updateGroup,
  setTree,
  setBoardTeam,
  addAssignment,
  deleteAssignment,
  addCommentIcon,
} from './kanbanSlice'

import { useAuth0 } from '../../react-auth0-spa'

const KanbanContainer = props => {
  const [mounted, setMounted] = useState(false)
  const [prevSelectedNode, setPrevSelectedNode] = useState(null)
  const { getTokenSilently } = useAuth0()

  useEffect(() => {
    if (props.selectedNode != "" && props.selectedNode != null && props.selectedProject != "" && props.selectedProject != null) {
      fetchTree()
    }
  }, [props.selectedProject, props.selectedNode])

  const fetchTree = async () => {
    const api = process.env.REACT_APP_API
    const treeUrl = api + '/tree?project=' + props.selectedProject

    try {
      const token = await getTokenSilently()

      const treeResult = await fetch(treeUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const tree = await treeResult.json()
      props.dispatch(setTree({tree: tree}))

      if (props.selectedNode.length > 20) {
        const root = tree.find(node => node._id == props.selectedNode)
        props.dispatch(setSelectedNode({id: root._id}))
        fetchGroups(root._id)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const fetchGroups = async (boardId) => {
    const api = process.env.REACT_APP_API
    const treeUrl = api + '/tree'

    try {
      const token = await getTokenSilently()
      const groupsUrl = api + '/groups?board_id=' + boardId

      const groupsResult = await fetch(groupsUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const groups = await groupsResult.json()

      groups.sort((a, b) => a.order - b.order)

      props.dispatch(setGroups({groups: groups}))

    } catch (error) {
      console.log(error)
    }

  }

  const onAddCard = async (groupId) => {
    try {

      const token = await getTokenSilently()
      const api = process.env.REACT_APP_API
      const project = props.selectedProject
      const parent = props.selectedNode
      const url = api + '/boards/add'
        + '?group=' + groupId
        + '&project=' + project
        + '&parent=' + parent

      const boardResult = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

      const board = await boardResult.json()

      props.dispatch(addBoard({board: board}))

    } catch(error) {
      console.log(error)
    }
  }

  const onAddCardDeprecated = async (groupId, isTeam) => {
    console.log(groupId)
    console.log(props.selectedNode)
    try {
      const token = await getTokenSilently()
      const api = process.env.REACT_APP_API
      const title = ''
      const treeUrl = api + '/tree'
      const treeResult = await fetch(treeUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const tree = await treeResult.json()

      const parent = props.selectedNode
      const team = props.tree.find(node => node._id === parent).team
      const url = api + '/boards/add?group=' + groupId
        + '&title=' + title + '&parent=' + parent
        + '&isteam=' + isTeam + '&team=' + team

      const addResult = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await addResult.json()

      props.dispatch(addBoard({board: result.board, boardRef: result.boardRef}))
    } catch (error) {
      console.log(error)
    }

  }

  const onCardClick = async (cardId) => {
    try {

      console.log({cardId})
      props.dispatch(setSelectedNode({id: cardId}))

    } catch(error) {
      console.log(error)
    }
  }

  const onGroupOrderUpdate = (id, source, destination) => {
    console.log(source)
    console.log(destination)

    // Splice groups
    const newGroupsOrder = Array.from(props.groups)

    newGroupsOrder.splice(source, 1)
    newGroupsOrder.splice(destination, 0, props.groups
      .filter(group => group._id === id)[0])

    newGroupsOrder.forEach((group, index) => {
      onUpdateGroup(group._id, {order: index})
    })
  }

  const onCardOrderUpdate = (id, groupId, source, destination) => {
    const newCardsOrder = Array.from(props.tree
      .filter(board => board.parent === props.selectedNode)
      .filter(board => board.group === groupId)
      .sort((a, b) => b.order - a.order))

    newCardsOrder.splice(source, 1)
    newCardsOrder.splice(destination, 0,
      props.tree.find(board => board._id === id)
    )

    newCardsOrder.forEach((board, index) => {
      onUpdateCard(board._id, {order: newCardsOrder.length - index - 1})
    })
  }

  const onCardGroupUpdate = (id, destinationId, destination) => {
    const order = Math.max(...props.tree
      .filter(board => board.parent === props.selectedNode)
      .filter(board => board.group === destinationId)
      .map(board => board.order)) + 1

    const object = {group: destinationId, order: order}
    props.dispatch(updateBoard({id: id, object: object}))

    const boards = props.tree
      .filter(board => board.parent === props.selectedNode)
      .filter(board => board.group === destinationId)
      .sort((a, b) => b.order - a.order)
    console.log(boards)

    boards.splice(order, 1)
    boards.splice(destination, 0,
      props.tree
        .filter(board => board.parent === props.selectedNode)
        .find(board => board._id === id)
    )


    boards.forEach((board, index) => {
      const newOrder = boards.length - 1 - index
      onUpdateCardGroup(board._id, {order: newOrder, group: destinationId})
    })

  }

  const onUpdateGroup = async (id, object) => {
    console.log(id)
    console.log(object)
    props.dispatch(updateGroup({id: id, object: object}))
    const api = process.env.REACT_APP_API
    const url = api + '/groups/update' + '?id=' + id
    console.log(object)

    try {
      const token = await getTokenSilently()
      const updateResult = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(object)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onUpdateCard = async (id, object) => {
    props.dispatch(updateBoard({id: id, object: object}))

    const api = process.env.REACT_APP_API
    const url = api + '/board/update' + '?id=' + id

    try {
      const token = await getTokenSilently()
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(object)
      })
    } catch(error) {
      console.log(error)
    }
  }

  const onUpdateCardGroup = async (id, object) => {
    props.dispatch(updateBoard({id: id, object: object}))

    const api = process.env.REACT_APP_API
    const url = api + '/board/update' + '?id=' + id

    try {
      const token = await getTokenSilently()
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(object)
      })
    } catch(error) {
      console.log(error)
    }
  }

  const onAddGroup = async () => {
    const owner = props.owner
    const api = process.env.REACT_APP_API
    const url = api + '/groups/add?owner=' + owner + '&board=' + props.selectedNode
    const token = await getTokenSilently()
    const addResult = await fetch(url, {method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const group = await addResult.json()

    console.log(group)

    props.dispatch(addGroup({group: group}))
  }

  const onCardDelete = async (id) => {
    const deleteCard = window.confirm('Hit OK to delete the card')

    if (deleteCard === true) {

      props.dispatch(cardDelete({card: id}))
      console.log('delete ' + id)
      try {
        const token = await getTokenSilently()
        const result = fetch(
          process.env.REACT_APP_API + '/boards?id=' + id , {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      } catch(error) {
        console.log(error)
      }
    }
  }

  const onGroupDelete = async (id, title) => {
    const deleteGroup = window.prompt('Confirm group name to delete:')

    if (deleteGroup === title) {
      console.log('detete group: ' + id)

      props.dispatch(groupDelete({group: id}))

      try {
        const token = await getTokenSilently()
        const result = fetch(
          process.env.REACT_APP_API + '/groups?id=' + id , {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        console.log(result)
      } catch(error) {
        console.log(error)
      }
    }
  }

  const onTeamChange = async (team, board) => {
    console.log('onteamchange')
    props.dispatch(setBoardTeam({team: team, board: board}))
    const url = process.env.REACT_APP_API + '/boards/update/team'
    try {
      const token = await getTokenSilently()
      const result = await fetch(
        url + '?team=' + team + '&board=' + board,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      console.log(result)
    } catch(error) {
      console.log(error)
    }
  }

  const constructQueryArray = (url, array, name) => {
    var i = 0

    for (const el of array) {
      if (i === 0) {
        url += '?' + name + '[]=' + el
      } else {
        url += '&' + name + '[]=' + el
      }

      i += 1
    }

    return url
  }

  const onAddAssignment = async (userId, cardId) => {
    try {
      props.dispatch(addAssignment({board: cardId, assignee: userId}))

      const token = await getTokenSilently()
      const api = process.env.REACT_APP_API
      const url = api + '/assignment'
        + '?board=' + cardId
        + '&assignee=' + userId

      const assignmentResult = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

      props.fetchAssignments()

    } catch(error) {
      console.log(error)
    }
  }

  const onDeleteAssignment = async (userId, cardId) => {
    try {

      props.dispatch(deleteAssignment({board: cardId, assignee: userId}))

      const token = await getTokenSilently()
      const api = process.env.REACT_APP_API
      const url = api + '/assignment'
        + '?board=' + cardId
        + '&assignee=' + userId

      const assignmentResult = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

      props.fetchAssignments()

    } catch(error) {
      console.log(error)
    }
  }

  const onSubmitComment = async (text, board) => {
    try {

      const token = await getTokenSilently()
      const url = process.env.REACT_APP_API + '/comments'
        + '?text=' + text.replace(/\n/g, '%0A')
        + '&board=' + board
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const comment = await result.json()
      props.dispatch(addComment({comment: comment}))
      props.dispatch(addCommentIcon({board: board}))

    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div style={props.style}>
      <Kanban
        boards={props.tree
        .filter(board => board.parent === props.selectedNode)
        .sort((a, b) => b.order - a.order)
        }
        groups={props.groups}
        comments={props.comments}
        onSubmitComment={onSubmitComment}
        teams={props.teams}
        tree={props.tree}
        onCardClick={onCardClick}
        onAddCard={onAddCard}
        onUpdateCard={onUpdateCard}
        onAddGroupClick={onAddGroup}
        onUpdateGroup={onUpdateGroup}
        onAddAssignment={onAddAssignment}
        onDeleteAssignment={onDeleteAssignment}
        onCardDelete={onCardDelete}
        onGroupDelete={onGroupDelete}
        onGroupOrderUpdate={onGroupOrderUpdate}
        onCardOrderUpdate={onCardOrderUpdate}
        onCardGroupUpdate={onCardGroupUpdate}
        onTeamChange={onTeamChange}
        members={props.members}
        selectedNode={props.selectedNode}
      />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    members: state.teams.members,
    groups: state.kanban.groups,
    teams: state.teams.teams,
    tree: state.kanban.tree,
    comments: state.comments.comments,
  }
}

export default connect(mapStateToProps)(KanbanContainer)
