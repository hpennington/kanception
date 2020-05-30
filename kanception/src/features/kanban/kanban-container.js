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
      prevSelectedNode: null,
    }

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
    const nodeId = await this.fetchBoardsInit()
    this.props.setSelectedNode(nodeId)
  }

  async componentDidUpdate() {
    if (this.state.prevSelectedNode !== this.props.selectedNode) {
      this.setState({prevSelectedNode: this.props.selectedNode})
      this.fetchBoards()
    }
  }

  async fetchBoardsInit() {
    const owner = this.props.owner
    const api = 'http://localhost:4000'
    const treeUrl = api + '/tree?owner=' + owner

    try {
      const treeResult = await fetch(treeUrl)
      const tree = await treeResult.json()
      const root = tree.find(node => node.parent === null)
      let boardIds = tree.filter(node => node.parent === root._id).map(node => node.board)
      boardIds.push(root.board)

      const boardsUrl = this.constructQueryArray(api + '/boards', boardIds, 'ids')

      const boardsResult = await fetch(boardsUrl)
      const boards = await boardsResult.json()

      const groupIds = boards.find(board => board._id === root.board).groups
      const groupsUrl = this.constructQueryArray(api + '/groups', groupIds, 'ids')

      const groupsResult = await fetch(groupsUrl)
      const groups = await groupsResult.json()

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

  async fetchBoards() {
    const owner = this.props.owner
    const api = 'http://localhost:4000'
    const treeUrl = api + '/tree?owner=' + owner

    try {
      const treeResult = await fetch(treeUrl)
      const tree = await treeResult.json()
      const root = tree.find(node => node._id === this.props.selectedNode)
      let boardIds = tree.filter(node => node.parent === root._id).map(node => node.board)
      boardIds.push(root.board)

      const boardsUrl = this.constructQueryArray(api + '/boards', boardIds, 'ids')

      const boardsResult = await fetch(boardsUrl)
      const boards = await boardsResult.json()

      const groupIds = boards.find(board => board._id === root.board).groups
      const groupsUrl = this.constructQueryArray(api + '/groups', groupIds, 'ids')

      const groupsResult = await fetch(groupsUrl)
      const groups = await groupsResult.json()

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
    console.log(this.props.selectedNode)
    const api = 'http://localhost:4000'
    const title = ''
    const owner = this.props.owner
    const treeUrl = api + '/tree?owner=' + owner
    const treeResult = await fetch(treeUrl)
    const tree = await treeResult.json()
    console.log(tree)

    const parent = this.props.selectedNode
    console.log(parent)
    const url = api + '/boards/add?group=' + groupId
      + '&title=' + title + '&owner=' + owner + '&parent=' + parent

    const addResult = await fetch(url, {method: 'POST'})
    const result = await addResult.json()

    this.props.dispatch(addBoard({board: result.board}))
  }

  async onUpdateCard(id, object) {
    this.props.dispatch(updateBoard({id: id, object: object}))

    const api = 'http://localhost:4000'
    const url = api + '/boards/update' + '?id=' + id

    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(object)
    })

  }

  async onUpdateGroup(id, object) {
    console.log(id)
    console.log(object)
    this.props.dispatch(updateGroup({id: id, object: object}))
    const api = 'http://localhost:4000'
    const url = api + '/groups/update' + '?id=' + id
    console.log(object)

    const updateResult = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(object)
    })
  }

  async onCardClick(cardId) {

    const owner = this.props.owner
    const api = 'http://localhost:4000'
    const clickedBoardUrl = this.constructQueryArray(api + '/boards', [cardId], 'ids')

    try {

      const result = await fetch(clickedBoardUrl)
      const boards = await result.json()

      if (boards.length > 0) {
        const board = boards[0]


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
            const boardsUrl = this.constructQueryArray(api + '/boards', boardIds, 'ids')

            const boardsResult = await fetch(boardsUrl)
            const boards = await boardsResult.json()


            const selectedNode = tree.find(node => node.board === cardId)._id

            this.props.setSelectedNode( selectedNode)
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
    const owner = this.props.owner
    const api = 'http://localhost:4000'
    const url = api + '/groups/add?owner=' + owner + '&board=' + this.props.selectedNode

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

  onGroupOrderUpdate(id, source, destination) {
    console.log(source)
    console.log(destination)

    // Splice groups
    const newGroupsOrder = Array.from(this.props.groups)

    newGroupsOrder.splice(source, 1)
    newGroupsOrder.splice(destination, 0, this.props.groups
      .filter(group => group._id === id)[0])

    newGroupsOrder.forEach((group, index) => {
      this.onUpdateGroup(group._id, {order: index})
    })
  }

  onCardOrderUpdate(id, groupId, source, destination) {
    const newCardsOrder = Array.from(this.props.boards
      .filter(board => board.group === groupId)
      .sort((a, b) => b.order - a.order))

    newCardsOrder.splice(source, 1)
    newCardsOrder.splice(destination, 0,
      this.props.boards.find(board => board._id === id)
    )

    newCardsOrder.forEach((board, index) => {
      this.onUpdateCard(board._id, {order: newCardsOrder.length - index - 1})
    })
  }

  onCardGroupUpdate(id, destinationId, destination) {
    const order = Math.max(...this.props.boards
      .filter(board => board.group === destinationId)
      .map(board => board.order)) + 1

    const object = {group: destinationId, order: order}
    this.props.dispatch(updateBoard({id: id, object: object}))

    const boards = this.props.boards
      .filter(board => board.group === destinationId)
      .sort((a, b) => b.order - a.order)
    console.log(boards)

    boards.splice(order, 1)
    boards.splice(destination, 0,
      this.props.boards.find(board => board._id === id)
    )


    boards.forEach((board, index) => {
      const newOrder = boards.length - 1 - index
      this.onUpdateCard(board._id, {order: newOrder, group: destinationId})
    })

  }

  render() {
    return (
      <div style={this.props.style}>
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
          onGroupOrderUpdate={this.onGroupOrderUpdate.bind(this)}
          onCardOrderUpdate={this.onCardOrderUpdate.bind(this)}
          onCardGroupUpdate={this.onCardGroupUpdate.bind(this)}
        />
      </div>
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
