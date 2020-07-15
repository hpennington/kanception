import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import GanttCanvas from './gantt-canvas'
import './gantt.css'

const GanttChart = () => {
  const container = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  })

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

  const onPan = offsetBy => {
    setOffset({x: offset.x + offsetBy.x, y: offset.y + offsetBy.y})
  }

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
            height: "calc(100vh - 200px)",
            marginLeft: "200px",
            width: "100%",
          }}
          ref={container}
        >
          {
          isMounted === true &&
          <GanttCanvas
            width={width}
            height={height}
            offset={offset}
            onPan={onPan}
          />
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
