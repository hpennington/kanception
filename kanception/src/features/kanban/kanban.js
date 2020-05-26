import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './card'
import './kanban.css'

export default function Kanban(props) {
  const [contextMenuCardOpen, setContextMenuCardOpen] = useState(false)
  const [contextCardId, setContextCardId] = useState(null)
  const [contextMenuCardPosition, setContextMenuCardPosition] = useState({x: 0, y: 0})
  const [contextMenuGroupPosition, setContextMenuGroupPosition] = useState({x: 0, y: 0})
  const [contextMenuGroupOpen, setContextMenuGroupOpen] = useState(false)
  const [contextGroupId, setContextGroupId] = useState(null)

  useEffect(() => {
    const groups = document.getElementsByClassName('column')

    if (groups.length > 1) {
      console.log(groups.length)
      for (const group of groups) {

        group.oncontextmenu = e => {
          console.log('group contextmenu')
          e.preventDefault()
          e.stopPropagation()
          onContextMenuGroupClick(e.target.dataset.groupId, e)
        }
      }

    }

  })

  const onAddCard = e => {
    props.onAddCard(e.target.dataset.groupId)
  }

  const onUpdateCardTitle = e => {
    props.onUpdateCard(e.target.parentNode.id, {title: e.target.value})
  }

  const onUpdateGroupTitle = e => {
    props.onUpdateGroup(e.target.dataset.groupId, {title: e.target.value})
  }

  const onContextMenuCardClick = (id, event) => {
    setContextCardId(id)
    setContextMenuCardOpen(!contextMenuCardOpen)
    setContextMenuGroupOpen(false)
    setContextMenuCardPosition({x: event.clientX, y: event.clientY})
  }

  const onContextMenuGroupClick = (id, event) => {
    setContextGroupId(id)
    setContextMenuGroupOpen(!contextMenuGroupOpen)
    setContextMenuCardOpen(false)
    setContextMenuGroupPosition({x: event.clientX, y: event.clientY})
  }

  const onGroupDelete = e => {
    setContextMenuGroupOpen(false)
    props.onGroupDelete(contextGroupId, props.groups.find(group => group._id === contextGroupId).title)
  }

  const onBoardClick = () => {
    setContextMenuCardOpen(false)
    setContextMenuGroupOpen(false)
  }

  const onDragEnd = e => {
    if (e.destination !== null) {
      if (e.destination.droppableId === 'kanbanRoot') {
        onGroupDrop(e)
      } else {
        onCardDrop(e)
      }
    }
  }

  const onGroupDrop = e => {
    if (e.source.index !== e.destination.index) {
      props.onGroupOrderUpdate(
        e.draggableId,
        e.source.index, e.destination.index
      )
    }
  }

  const onCardDrop = e => {
  }

  return (
    <div className="kanban" onClick={onBoardClick}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="kanbanRoot" direction="horizontal" type="COLUMN">
          {provided => (
          <div
            id="kanbanRoot"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.groups.map((group, index) =>
            <div className="group">
              <div className="group-control">
                <button className="hide">+</button>
                <input placeholder="Group Title"
                  className="group-title-input"
                  type="text"
                  onChange={onUpdateGroupTitle}
                  value={group.title}
                  data-group-id={group._id}
                ></input>
                <button data-group-id={group._id} onClick={onAddCard}>+</button>
              </div>
              <Draggable key={group._id}
                draggableId={group._id}
                index={index} type="COLUMN"
              >
                {dragProvided =>
                <div
                  data-group-id={group._id}
                  className="column"
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                >
                  <Droppable droppableId={group._id}>
                    {provided2 => (
                    <div
                      {...provided2.droppableProps}
                      ref={provided2.innerRef}
                    >
                     {
                      props.boards
                      .filter(board => board.group === group._id)
                      .map((column, cardIndex) =>
                        <Card
                          onCardClick={props.onCardClick}
                          id={column._id}
                          onUpdateCardTitle={onUpdateCardTitle}
                          title={column.title}
                          column={index}
                          index={cardIndex}
                          onContextClick={onContextMenuCardClick}
                        />
                      )
                      }
                      {provided2.placeholder}
                    </div>
                    )}
                  </Droppable>
                </div>
                }
              </Draggable>
            </div>
            )}
            {provided.placeholder}
            <diV className="group">
              <button className="hide">+</button>
              <input
                placeholder="Group Title"
                className="group-title-input hide"
                type="text"
              ></input>
              <button onClick={props.onAddGroupClick}
                className="column pointer add-group-btn"
                style={{height: "fit-content"}}
              >
              {
                'Add New Group'
              }
              </button>
            </diV>
            <CardContextMenu
              cardId={contextCardId}
              isOpen={contextMenuCardOpen}
              onClose={e => setContextMenuCardOpen(false)}
              onCardDelete={e => props.onCardDelete(contextCardId)}
              position={contextMenuCardPosition}
            />
            <GroupContextMenu
              groupId={contextGroupId}
              isOpen={contextMenuGroupOpen}
              onClose={e => setContextMenuGroupOpen(false)}
              onGroupDelete={onGroupDelete}
              position={contextMenuGroupPosition}
            />
          </div>
          )}
          </Droppable>
      </DragDropContext>
    </div>
  )
}

const CardContextMenu = props => {
  const style = {
    visibility: props.isOpen === true ? 'visible' : 'hidden',
    top: props.position.y,
    left: props.position.x,
  }

  const onContextMenu = e => {
    e.preventDefault()
    props.onClose(e)
  }

  return (
    <div
      data-card-id={props.cardId}
      className="context-menu"
      style={style}
      onContextMenu={onContextMenu}
    >
      <h6 onClick={props.onCardDelete} className="border-bottom">Delete Card</h6>
      <h6 onClick={props.onClose} className="border-top">Close</h6>
    </div>
  )
}

const GroupContextMenu = props => {
  const style = {
    visibility: props.isOpen === true ? 'visible' : 'hidden',
    top: props.position.y,
    left: props.position.x,
  }

  const onContextMenu = e => {
    e.preventDefault()
    props.onClose(e)
  }

  return (
    <div
      data-group-id={props.groupId}
      className="context-menu"
      style={style}
      onContextMenu={onContextMenu}
    >
      <h6 onClick={props.onGroupDelete} className="border-bottom">Delete Group</h6>
      <h6 onClick={props.onClose} className="border-top">Close</h6>
    </div>
  )
}
