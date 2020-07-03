import React, {
  useEffect, useState, useRef, forwardRef, useImperativeHandle
} from 'react'
import { connect } from 'react-redux'
import Kanban from './kanban'
import {
  setGroups,
  setBoards,
  addGroup,
  addBoard,
  updateBoard,
  updateGroup,
  setTree,
  setBoardTeam,
} from './kanbanSlice'

import { useAuth0 } from '../../react-auth0-spa'

const KanbanContainer = props => {
  const [mounted, setMounted] = useState(false)
  const [prevSelectedNode, setPrevSelectedNode] = useState(null)
  const { getTokenSilently } = useAuth0()

  useEffect(() => {
    fetchTree()
  }, [props.selectedNode])

  const fetchTree = async () => {
    const api = 'http://localhost:4000'
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

      const root = tree.find(node => node._id == props.selectedNode)
      props.setSelectedNode(root._id)
      console.log(root)
      const groupIds = root.groups
      console.log(groupIds)

      fetchGroups(groupIds)

    } catch (error) {
      console.log(error)
    }
  }

  const fetchGroups = async (groupIds) => {
    const api = 'http://localhost:4000'
    const treeUrl = api + '/tree'

    try {
      const token = await getTokenSilently()
      const groupsUrl = constructQueryArray(api + '/groups', groupIds, 'ids')

      const groupsResult = await fetch(groupsUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const groups = await groupsResult.json()

      groups.sort((a, b) => a.order - b.order)
      console.log(groups)

      props.dispatch(setGroups({groups: groups}))

    } catch (error) {
      console.log(error)
    }

  }

  const onAddCard = async (groupId) => {
    try {

      const token = await getTokenSilently()
      const api = 'http://localhost:4000'
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

      const boardObject = await boardResult.json()

      //props.dispatch(addBoard({board: boardObject.board}))

    } catch(error) {
      console.log(error)
    }
  }

  const onAddCardDeprecated = async (groupId, isTeam) => {
    console.log(groupId)
    console.log(props.selectedNode)
    try {
      const token = await getTokenSilently()
      const api = 'http://localhost:4000'
      const title = ''
      const treeUrl = api + '/tree'
      const treeResult = await fetch(treeUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const tree = await treeResult.json()
      console.log(tree)

      const parent = props.selectedNode
      console.log(parent)
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

      props.setSelectedNode(cardId)

    } catch(error) {
      console.log(error)
    }
  }

  const onCardClickDeprectated = async (cardId) => {
    console.log('ONCARDCLICK')

    const api = 'http://localhost:4000'
    const clickedBoardUrl = constructQueryArray(api + '/team/boards', [cardId], 'ids')

    try {

      const token = await getTokenSilently()

      const result = await fetch(clickedBoardUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const boards = await result.json()

      if (boards.length > 0) {
        const board = boards[0]


        if (board.groups.length > 0) {
          const groupsUrl = constructQueryArray(api + '/groups', board.groups, 'ids')

          const groupsResult = await fetch(groupsUrl, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const groups = await groupsResult.json()

          const treeUrl = api + '/tree'
          const treeResult = await fetch(treeUrl, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const tree = await treeResult.json()
          props.dispatch(setTree({tree: tree}))

          const clickedNode = tree.find(node => node.board === cardId)

          if (clickedNode !== null) {
            console.log(clickedNode)
            console.log(tree)
            const boardIds = tree
              .filter(node => node.parent === clickedNode._id)
              .map(node => node.board)
            const boardsUrl = constructQueryArray(api + '/team/boards', boardIds, 'ids')

            const boardsResult = await fetch(boardsUrl, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            const boards = await boardsResult.json()


            const selectedNode = tree.find(node => node.board === cardId)._id

            props.setSelectedNode(selectedNode)
            props.dispatch(setGroups({groups: groups}))
            props.dispatch(setBoards({boards: boards}))
          }
        }
      }

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
    const newCardsOrder = Array.from(props.boards
      .filter(board => board.group === groupId)
      .sort((a, b) => b.order - a.order))

    newCardsOrder.splice(source, 1)
    newCardsOrder.splice(destination, 0,
      props.boards.find(board => board._id === id)
    )

    newCardsOrder.forEach((board, index) => {
      onUpdateCard(board._id, {order: newCardsOrder.length - index - 1})
    })
  }

  const onCardGroupUpdate = (id, destinationId, destination) => {
    const order = Math.max(...props.boards
      .filter(board => board.group === destinationId)
      .map(board => board.order)) + 1

    const object = {group: destinationId, order: order}
    props.dispatch(updateBoard({id: id, object: object}))

    const boards = props.boards
      .filter(board => board.group === destinationId)
      .sort((a, b) => b.order - a.order)
    console.log(boards)

    boards.splice(order, 1)
    boards.splice(destination, 0,
      props.boards.find(board => board._id === id)
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
    const api = 'http://localhost:4000'
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

    const api = 'http://localhost:4000'
    const url = api + '/boards/update' + '?id=' + id

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
    //props.dispatch(updateBoard({id: id, object: object}))

    const api = 'http://localhost:4000'
    const url = api + '/boardrefs/update' + '?id=' + id

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
    const api = 'http://localhost:4000'
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

  const onCardDelete = (id) => {
    const deleteCard = window.confirm('Hit OK to delete the card')

    if (deleteCard === true) {
      console.log('delete ' + id)
    }
  }

  const onGroupDelete = (id, title) => {
    const deleteGroup = window.prompt('Confirm group name to delete:')

    if (deleteGroup === title) {
      console.log('detete group: ' + id)
    }
  }

  const onTeamChange = async (team, board) => {
    console.log('onteamchange')
    props.dispatch(setBoardTeam({team: team, board: board}))
    const url = 'http://localhost:4000/boards/update/team'
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

  return (
    <div style={props.style}>
      <Kanban
        boards={props.tree.filter(board => board.parent === props.selectedNode)}
        groups={props.groups}
        teams={props.teams}
        tree={props.tree}
        onCardClick={onCardClick}
        onAddCard={onAddCard}
        onUpdateCard={onUpdateCard}
        onAddGroupClick={onAddGroup}
        onUpdateGroup={props.onUpdateGroup}
        onCardDelete={onCardDelete}
        onGroupDelete={onGroupDelete}
        onGroupOrderUpdate={onGroupOrderUpdate}
        onCardOrderUpdate={onCardOrderUpdate}
        onCardGroupUpdate={onCardGroupUpdate}
        onTeamChange={onTeamChange}
      />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    groups: state.kanban.groups,
    teams: state.teams.teams,
    tree: state.kanban.tree,
  }
}

export default connect(mapStateToProps)(KanbanContainer)
