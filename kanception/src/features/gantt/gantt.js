import React from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import './gantt.css'

const charts = [0, 1, 2, 3, 4, 5, 6, 7]

const GanttChart = () => {
  return (
    <div
      className="gantt"
    >
      {
      charts.map(index =>
        <Droppable
          droppableId={"gantt-droppable-" + index}
        >
          {provided =>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="gantt-channel"
          >
          </div>
          }
        </Droppable>
      )
      }
    </div>
  )
}

const mapStateToProps = state => {
  return {
    boards: state.kanban.boards
  }
}

export default connect(mapStateToProps)(GanttChart)
