import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import './list-view.css'

const BoardsListView = props => {
  return (
      <Droppable
        droppableId="list-view-droppable"
      >
        {provided =>
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
        >
          {props.boards.map((board, index) =>
          <ListCell id={board._id} title={board.title} index={index} />
          )}
          {provided.placeholder}
        </div>
        }
      </Droppable>
  )
}

const ListCell = props => {
  return (
    <Draggable
      draggableId={props.id}
      index={props.index}
    >
      {provided =>
      <div
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        ref={provided.innerRef}
        className="list-cell"
      >
        {props.title}
      </div>
      }
    </Draggable>
  )
}

const mapStateToProps = state => {
  return {
    boards: state.kanban.boards
  }
}

export default connect(mapStateToProps)(BoardsListView)

