import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './card'
import NewCardPopup from './new-card-popup'

const Group = props => {
  const [popupOpen, setPopupOpen] = useState(false)
  const [dragEnabled, setDragEnabled] = useState(true)

  const onContextMenuCardClick = (id, event) => {
    props.setContextCardId(id)
    props.setContextMenuCardOpen(!props.contextMenuCardOpen)
    props.setContextMenuGroupOpen(false)
    props.setContextMenuCardPosition({x: event.clientX, y: event.clientY})
  }

  const filterTeams = (id, teams) => {
    const boardRef = props.tree.find(node => node.board === id)
    const parentRef = props.tree.find(node => node._id === boardRef.parent)

    if (parentRef.isUserRoot === true) {
      if (boardRef.team === null || boardRef.team === undefined) {
        // Private only
        return [{_id: "Private", title: "Private"}]
      } else {
        // Team only
        return props.teams.filter(team => team._id === boardRef.team)
      }

    } else {

      if (parentRef.team === null || parentRef.team === undefined) {
        // Private only
        return [{_id: "Private", title: "Private"}]
      } else {
        // Team or private
        return [
          {_id: "Private", title: "Private"},
          props.teams.find(team => team._id === parentRef.team)
        ]
      }
    }
  }

  const onAddCard = e => {
    props.onAddCard(e.target.dataset.groupId)
  }

  const onUpdateCardTitle = e => {
    props.onUpdateCard(e.target.dataset.cardId, {title: e.target.value})
  }

  const onUpdateGroupTitle = e => {
    props.onUpdateGroup(e.target.dataset.groupId, {title: e.target.value})
  }

  return (
    <div className="group">
      <Draggable key={props.group._id}
        draggableId={props.group._id}
        index={props.index} type="COLUMN"
        data-group-id={props.group._id}
        isDragDisabled={!dragEnabled}
      >
        {dragProvided =>
      <div
        className="group-container"
        ref={dragProvided.innerRef}
        data-group-id={props.group._id}
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
      >
        <div className="group-control"
          data-group-id={props.group._id}
        >
          <button className="hide">
            +
          </button>
          <input placeholder="Group Title"
            className="group-title-input"
            type="text"
            onChange={onUpdateGroupTitle}
            value={props.group.title}
            data-group-id={props.group._id}
          ></input>
          <button data-group-id={props.group._id} onClick={onAddCard}
          >
            +
          </button>
        </div>
          <div
            data-group-id={props.group._id}
            className="column"
          >
            <Droppable droppableId={props.group._id}>
              {provided => (
              <div
                className="rbd-droppable-context"
                data-group-id={props.group._id}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
               {
                props.boards
                .filter(board => board.group === props.group._id)
                .map((column, cardIndex) =>
                  <Card
                    key={column._id}
                    onSubmitComment={props.onSubmitComment}
                    comments={props.comments
                      .filter(comment => comment.board === column._id)}
                    dragEnabled={dragEnabled}
                    setDragEnabled={setDragEnabled}
                    team={props.tree.find(node => node._id === column._id).project}
                    assignees={column.assignees}
                    members={props.members}
                    onCardClick={props.onCardClick}
                    id={column._id}
                    onTeamChange={props.onTeamChange}
                    onUpdateCardTitle={onUpdateCardTitle}
                    title={column.title}
                    column={props.index}
                    index={cardIndex}
                    onContextClick={onContextMenuCardClick}
                    count={column.count}
                  />
                )
                }
                {provided.placeholder}
              </div>
              )}
            </Droppable>
          </div>
        </div>
      }
      </Draggable>
    </div>
  )
}

export default Group
