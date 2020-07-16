import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import GanttCanvas from './gantt-canvas'
import './gantt.css'

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
      return {offset: {x: this.state.offset.x - pan.x, y: this.state.offset.y + pan.y}}
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
              width={this.state.width}
              height={this.state.height}
              offset={this.state.offset}
              onPan={this.onPan.bind(this)}
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
    boards: state.kanban.boards
  }
}

export default connect(mapStateToProps)(GanttChart)
