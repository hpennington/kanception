import React, { useState, useEffect, useRef } from 'react'
import TextAreaAutoSize from 'react-textarea-autosize'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import './table-view.css'

const NewCard = props => {
  const groupSelect = useRef()

  const onAcceptCard = e => {
    const group = groupSelect.current.children[groupSelect.current.selectedIndex].dataset.groupId
    props.onAcceptCard(props.id, group)
  }

  return (
    <div
      className="kanception-card"
      id={props.id}
    >
      <p
        data-card-id={props.id}
        onClick={e => e.stopPropagation()}
        style={{
          color: "white",
          background: "inherit",
          height: "2rem",
          border: "none",
          textAlign: "center",
          resize: "none",
          margin: 0,
          marginTop: "10px",
          userSelect: "none",
        }}
      >
        {props.title}
      </p>

      <div style={{display: "flex", alignItems: "baseline"}}>
        <p style={{margin: "10px"}}>Save to:</p>
        <select ref={groupSelect}>
          {props.groups.map(group =>
            <option data-group-id={group._id}>{group.title}</option>
          )}
        </select>
        <button
          onClick={onAcceptCard}
          style={{
            margin: "10px",
            borderRadius: "10px",
            width: "50px",
            height: "30px",
            background: "#370080",
            color: "white",
            border: "none",
          }}>Save</button>
      </div>
    </div>
  )
}

const TableView  = props => {
  const onCellClick = e => {
    props.onSetSelectedTeam(e.target.dataset.cellId)
  }

  return (
    <div
      style={{marginLeft: "30px", marginRight: "30px"}}
      className="table-view">
      {
      props.cells.map((cell, index) =>
      <NewCard onAcceptCard={props.onAcceptCard}
        groups={props.groups} title={cell.title} id={cell._id} index={index} />
      )
      }
    </div>
  )
}

export default TableView
