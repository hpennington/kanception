import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import GanttCanvas from './gantt-canvas'
import { updateBoard, setTree } from '../kanban/kanbanSlice'
import { setSelectedNode } from '../projects/projectsSlice'
import './gantt.css'

const hourMS = 60 * 60 * 1000
const dayMS = 24 * hourMS
const HOUR = 'hour'
const DAY = 'day'

class GanttChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMounted: false,
      width: 0,
      height: 0,
      offset: {x: 0, y: 0},
      granularity: HOUR,
    }
  }

  componentDidMount = () => {
    this.setCanvasWidth()

    if (this.state.isMounted === false && this.refs.container !== null) {
      this.setState({isMounted: true})
    }

  }

  componentDidUpdate = prevProps => {
    if (prevProps.selectedNode !== this.props.selectedNode) {
      this.fetchTree()
    }
  }

 fetchTree = async () => {
    const api = process.env.REACT_APP_API
    const treeUrl = api + '/tree?project=' + this.props.selectedProject

    try {

      const treeResult = await fetch(treeUrl, {
        headers: {
          Authorization: `Bearer ${this.props.token}`
        }
      })

      const tree = await treeResult.json()
      this.props.dispatch(setTree({tree: tree}))

      console.log({tree, node: this.props.selectedNode, project: this.props.selectedProject})

      const root = tree.find(node => node._id == this.props.selectedNode)
      this.props.dispatch(setSelectedNode({id: root._id}))
      console.log(root)
      //      this.fetchGroups(root._id)

    } catch (error) {
      console.log(error)
    }
  }

  onPan = pan => {

    this.setState(state => {
      const rect = this.refs.container.getBoundingClientRect()
      const rowHeight = 50
      const maxOffset = (rowHeight * this.props.boards
        .filter(board => board.parent === this.props.selectedNode).length) - (rect.height - rowHeight)
      const updatedY = maxOffset > 0 ? (this.state.offset.y - pan.y) : -rect.height

      const finalY = updatedY >= 0
        ? (updatedY <= maxOffset ? updatedY : maxOffset)
        : 0

      const sidePanel = document.querySelector('.todo-inner-panel')
      sidePanel.scrollTo(0, finalY)

      return {offset: {x: this.state.offset.x - pan.x, y: finalY}}
    })
  }

  setCanvasWidth = () => {
    if (this.refs.container !== null) {
      const rect = this.refs.container.getBoundingClientRect()
      this.setState({width: rect.width, height: rect.height})
    }
  }

  onUpdateCard = async (id, object) => {
    const api = process.env.REACT_APP_API
    const url = api + '/board/update' + '?id=' + id

    try {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.token}`
        },
        body: JSON.stringify(object)
      })
    } catch(error) {
      console.log(error)
    }
  }

  onAddNode = (id, time) => {
    const deltaT = this.state.granularity === HOUR ? hourMS / 2 : dayMS / 2
    const start = time - deltaT
    const end = time + deltaT
    this.props.dispatch(updateBoard({id: id, object: {start: start, end: end}}))
    this.onUpdateCard(id, {start, end})
  }

  onGranularityChange = e => {
    const value = e.target.value
    this.setState(state => (
      {granularity: value, offset: {x: 0, y: state.offset.y}}
    ))
  }

  render() {
    return (
      <div style={{
          display: "flex",
          height: "calc(100% - 50px)",
          color: "#999",
        }}
      >
        <div
          className="todo-panel"
        >
          <div style={{height: "150px", zIndex: "100"}}>
          </div>
          <div className="todo-inner-panel">
            {
            this.props.boards
              .filter(board => board.parent === this.props.selectedNode)
              .map(todo => <div className="todo-cell"><p>{todo.title}</p></div>)
            }
          </div>
        </div>
        <div style={{width: "calc(100% - 200px)"}}>
          <div
            style={{
              height: "100px",
              width: "100%",
              marginLeft: "200px",
            }}
          >
            <select
              style={{margin: "40px"}}
              onChange={this.onGranularityChange.bind(this)}
              value={this.state.granularity}
            >
              <option value={HOUR}>Hour</option>
              <option value={DAY}>Day</option>
            </select>
          </div>
          <div
            style={{
              height: "calc(100vh - 150px)",
              marginLeft: "200px",
              width: "100%",
            }}
            ref="container"
          >
            {
            this.state.isMounted === true &&
            <GanttCanvas
              nodes={this.props.boards
                .filter(board => board.parent === this.props.selectedNode)
              }
              granularity={this.state.granularity}
              onAddNode={this.onAddNode}
              selectedNode={this.props.selectedNode}
              width={this.state.width}
              height={this.state.height}
              offset={this.state.offset}
              onPan={this.onPan.bind(this)}
              boards={this.props.boards
                .filter(board => board.parent === this.props.selectedNode)}
            />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    boards: state.kanban.tree,
    selectedProject: state.projects.selectedProject,
  }
}

export default connect(mapStateToProps)(GanttChart)
