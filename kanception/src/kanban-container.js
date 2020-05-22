import React from 'react'
import Kanban from './kanban'

export default class KanbanContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      boards: [],
      groups: [],
      selectedNode: null
    }

    this.owner = '5ec72e737651b82e08df7358'
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
      const groupsUrl = this.constructQueryArray(api + '/groups', groupIds, 'ids')

      const groupsResult = await fetch(groupsUrl)
      const groups = await groupsResult.json()

      this.setState({
        groups: groups,
        boards: boards,
      })

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


    this.setState(state => {
      return {
        boards: [result.board, ...state.boards]
      }
    })
  }

  async onUpdateCard(id, object) {
    console.log(id)
    console.log(object)

    this.setState(state => {

      const updatedBoard = Object.assign(state.boards.find(board => board._id === id), object)
      return {
        boards: [updatedBoard, ...state.boards.filter(board => board._id !== id)]
      }
    }, async () => {
      const api = 'http://localhost:4000'
      const url = api + '/boards/update'
      object._id = this.state.boards.find(board => board._id === id)._id
      console.log(object)

      const updateResult = await fetch(url,
        {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(object)}
      )

      console.log(updateResult)
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
            this.setState({groups: groups, boards: boards, selectedNode: selectedNode})
          }


        }
      }

    } catch(error) {
      console.log(error)
    }

  }

  render() {
    return (
      <Kanban
        onCardClick={this.onCardClick.bind(this)}
        onAddCard={this.onAddCard.bind(this)}
        onUpdateCard={this.onUpdateCard.bind(this)}
        boards={this.state.boards}
        groups={this.state.groups}
      />
    )
  }
}
