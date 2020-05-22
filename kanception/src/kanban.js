import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './card'
import './kanban.css'

export default function Kanban(props) {
  const onAddCard = e => {
    props.onAddCard(e.target.id)
  }

  const onUpdateCardTitle = e => {
    props.onUpdateCard(e.target.parentNode.id, {title: e.target.value})
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
              <h4>{group.title}</h4>
              <button id={group._id} onClick={onAddCard}>+</button>
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
                        <Card onCardClick={props.onCardClick}
                          id={column._id} onUpdateCardTitle={onUpdateCardTitle}
                          title={column.title} column={index} index={cardIndex} />
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
          </div>
          )}
          </Droppable>
      </DragDropContext>
    </div>
  )
}

