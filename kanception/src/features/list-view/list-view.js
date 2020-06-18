import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import './list-view.css'

const BoardsListView = props => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
      <ListCell setDragging={props.setDragging} setPosition={props.setPosition}/>
    </div>
  )
}

const ListCell = props => {

  const onMouseDown = e => {
    props.setPosition({x: e.clientX, y: e.clientY})
    props.setDragging(true)
  }

  return (
    <div
      className="list-cell"
      onMouseDown={onMouseDown}
    >
      Work on task 1 for bug #43
    </div>
  )
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(BoardsListView)

