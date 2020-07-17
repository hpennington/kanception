import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import GanttCanvas from './gantt-canvas'
import './gantt.css'

const todos = [
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
  'Todo X',
]

class GanttChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMounted: false,
      width: 0,
      height: 0,
      offset: {x: 0, y: 0}
    }
  }

  componentDidMount = () => {
    this.setCanvasWidth()

    if (this.state.isMounted === false && this.refs.container !== null) {
      this.setState({isMounted: true})
    }
  }

  onPan = pan => {

    this.setState(state => {
      const rect = this.refs.container.getBoundingClientRect()
      const rowHeight = 50
      const maxOffset = (rowHeight * this.props.boards
        .filter(board => board.parent === this.props.selectedNode).length) - (rect.height - rowHeight)
      const updatedY = this.state.offset.y - pan.y

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
            }}
          >
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
  }
}

export default connect(mapStateToProps)(GanttChart)
