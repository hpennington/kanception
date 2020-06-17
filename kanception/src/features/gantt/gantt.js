import React from 'react'
import { connect } from 'react-redux'
import './gantt.css'

const GanttChart = () => {
  return (
    <div className="gantt">
    </div>
  )
}

const mapStateToProps = state => {
  return {
    boards: state.kanban.boards
  }
}

export default connect(mapStateToProps)(GanttChart)
