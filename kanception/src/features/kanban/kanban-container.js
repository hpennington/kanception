import React from 'react'
import { connect } from 'react-redux'
import Kanban from './kanban'
import {
  setGroups,
  setBoards,
  addGroup,
  addBoard,
  updateBoard,
  updateGroup,
} from './kanbanSlice'

class KanbanContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedNode: null
    }

    this.owner = '5ecc321a843dbc117a2a8bd9'
  }

  constructQueryArray(url, array, name) {
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

  async componentWillMount() {
    const nodeId = await this.fetchBoards()
    this.setState({selectedNode: nodeId})
  }

  async fetchBoards() {
    const owner = this.owner
    const api = 'http://localhost:4000'
    const treeUrl = api + '/tree?owner=' + owner

    try {
      const treeResult = await fetch(treeUrl)
      const tree = await treeResult.json()
      console.log(tree)
      const root = tree.find(node => node.parent === null)
      let boardIds = tree.filter(node => node.parent === root._id).map(node => node.board)
      boardIds.push(root.board)

      const boardsUrl = this.constructQueryArray(api + '/boards', boardIds, 'ids')

      const boardsResult = await fetch(boardsUrl)
      const boards = await boardsResult.json()

      const groupIds = boards.find(board => board._id === root.board).groups
      console.log(groupIds)
      console.log(boards)
      const groupsUrl = this.constructQueryArray(api + '/groups', groupIds, 'ids')

      const groupsResult = await fetch(groupsUrl)
      const groups = await groupsResult.json()
      console.log(groups)

      groups.sort((a, b) => a.order - b.order)
      boards.sort((a, b) => b.order - a.order)

      this.props.dispatch(setGroups({groups: groups}))
      this.props.dispatch(setBoards({boards: boards}))

      return root._id

    } catch(error) {
      console.log(error)
    }

    return null
  }

  async onAddCard(groupId) {
    console.log(groupId)
    console.log(this.state.selectedNode)
    const api = 'http://localhost:4000'
    const title = ''
    const owner = this.owner
    const treeUrl = api + '/tree?owner=' + owner
    const treeResult = await fetch(treeUrl)
    const tree = await treeResult.json()
    console.log(tree)

    const parent = this.state.selectedNode
    console.log(parent)
    const url = api + '/boards/add?group=' + groupId
      + '&title=' + title + '&owner=' + owner + '&parent=' + parent

    const addResult = await fetch(url, {method: 'POST'})
    const result = await addResult.json()

    this.props.dispatch(addBoard({board: result.board}))
  }

  async onUpdateCard(id, object) {
    console.log(id)
    console.log(object)

    this.props.dispatch(updateBoard({id: id, object: object}))
    const api = 'http://localhost:4000'
    const url = api + '/boards/update'
    object._id = this.props.boards.find(board => board._id === id)._id
    console.log(object)

    const updateResult = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(object)
    })

    console.log(updateResult)
  }

  async onUpdateGroup(id, object) {
    console.log(id)
    console.log(object)
    this.props.dispatch(updateGroup({id: id, object: object}))
    const api = 'http://localhost:4000'
    const url = api + '/groups/update'
    object._id = this.props.groups.find(group => group._id === id)._id
    console.log(object)

    const updateResult = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(object)
    })
  }

  async fetchBoardsThrowAwayReturn() {
    const nodeId = await this.fetchBoards()
  }

  async onCardClick(cardId) {
    console.log(cardId)

    const owner = this.owner
    const api = 'http://localhost:4000'
    const clickedBoardUrl = this.constructQueryArray(api + '/boards', [cardId], 'ids')

    try {

      const result = await fetch(clickedBoardUrl)
      const boards = await result.json()

      if (boards.length > 0) {
        const board = boards[0]

        console.log(board)

        if (board.groups.length > 0) {
          const groupsUrl = this.constructQueryArray(api + '/groups', board.groups, 'ids')

          const groupsResult = await fetch(groupsUrl)
          const groups = await groupsResult.json()

          const treeUrl = api + '/tree?owner=' + owner
          const treeResult = await fetch(treeUrl)
          const tree = await treeResult.json()

          const clickedNode = tree.find(node => node.board === cardId)

          if (clickedNode !== null) {
            console.log(clickedNode)
            console.log(tree)
            const boardIds = tree
              .filter(node => node.parent === clickedNode._id)
              .map(node => node.board)
            console.log(boardIds)
            const boardsUrl = this.constructQueryArray(api + '/boards', boardIds, 'ids')

            const boardsResult = await fetch(boardsUrl)
            const boards = await boardsResult.json()

            console.log(boards)

            const selectedNode = tree.find(node => node.board === cardId)._id

            console.log(selectedNode)
            this.setState({selectedNode: selectedNode})
            this.props.dispatch(setGroups({groups: groups}))
            this.props.dispatch(setBoards({boards: boards}))
          }
        }
      }

    } catch(error) {
      console.log(error)
    }
  }

  async onAddGroup() {
    const owner = this.owner
    const api = 'http://localhost:4000'
    const url = api + '/groups/add?owner=' + owner + '&board=' + this.state.selectedNode

    const addResult = await fetch(url, {method: 'POST'})
    const group = await addResult.json()

    console.log(group)

    this.props.dispatch(addGroup({group: group}))
  }

  onCardDelete(id) {
    const deleteCard = window.confirm('Hit OK to delete the card')

    if (deleteCard === true) {
      console.log('delete ' + id)
    }
  }

  onGroupDelete(id, title) {
    const deleteGroup = window.prompt('Confirm group name to delete:')

    if (deleteGroup === title) {
      console.log('detete group: ' + id)
    }
  }

  render() {
    return (
      <Kanban
        boards={this.props.boards}
        groups={this.props.groups}
        onCardClick={this.onCardClick.bind(this)}
        onAddCard={this.onAddCard.bind(this)}
        onUpdateCard={this.onUpdateCard.bind(this)}
        onAddGroupClick={this.onAddGroup.bind(this)}
        onUpdateGroup={this.onUpdateGroup.bind(this)}
        onCardDelete={this.onCardDelete.bind(this)}
        onGroupDelete={this.onGroupDelete.bind(this)}
      />
    )
  }
}

const mapStateToProps = state => {
  const groups = state.kanban.groups
  const boards = state.kanban.boards

  return {
    groups,
    boards,
  }
}

export default connect(mapStateToProps)(KanbanContainer)
