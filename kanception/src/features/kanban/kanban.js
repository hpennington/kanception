import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './card'
import './kanban.css'

export default function Kanban(props) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false)

  const onAddCard = e => {
    props.onAddCard(e.target.dataset.groupId)
  }

  const onUpdateCardTitle = e => {
    props.onUpdateCard(e.target.parentNode.id, {title: e.target.value})
  }

  const onUpdateGroupTitle = e => {
    props.onUpdateGroup(e.target.dataset.groupId, {title: e.target.value})
  }

  return (
    <div className="kanban">
      <DragDropContext>
        <Droppable droppableId="kanbanRoot" direction="horizontal" type="COLUMN">
          {provided => (
          <div
            id="kanbanRoot"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.groups.map((group, index) =>
            <div>
              <button className="hide">+</button>
              <input placeholder="Group Title"
                className="group-title-input"
                type="text"
                onChange={onUpdateGroupTitle}
                value={group.title}
                data-group-id={group._id}
              ></input>
              <button data-group-id={group._id} onClick={onAddCard}>+</button>
              <Draggable draggableId={'c-' + index.toString()} index={index} type="COLUMN">
                {dragProvided =>
                <div
                  className="column"
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                >
                  <Droppable droppableId={'d-' +index.toString()}>
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
            <diV>
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
            <ContextMenu />
          </div>
          )}
          </Droppable>
      </DragDropContext>
    </div>
  )
}

const ContextMenu = props => {
  return (
    <div id="context-menu">
      <h6>Delete Card</h6>
    </div>
  )
}
