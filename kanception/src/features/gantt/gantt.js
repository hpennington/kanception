import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import GanttCanvas from './gantt-canvas'
import './gantt.css'

const GanttChart = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const container = useRef(null)

  useEffect(() => {
    if (container !== null) {
      const rect = container.current.getBoundingClientRect()
      setWidth(rect.width)
      setHeight(rect.height)
    }

    if (isMounted === false && container !== null) {
      setIsMounted(true)
    }
  })

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
      <div style={{width: "100%"}}>
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
            width: "100%",
          }}
          ref={container}
        >
          {
          isMounted === true &&
          <GanttCanvas width={width} height={height} />
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    boards: state.kanban.boards
  }
}

export default connect(mapStateToProps)(GanttChart)
