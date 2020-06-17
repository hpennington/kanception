import React from 'react'
import { connect } from 'react-redux'

const BoardsListView = () => {
  return (
    <div style={{
        height: "2000px",
      }}>
      List View
    </div>
  )
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(BoardsListView)

