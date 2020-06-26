import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './card'
import './kanban.css'

const Kanban = forwardRef((props, ref) => {
  const [contextMenuCardOpen, setContextMenuCardOpen] = useState(false)
  const [contextCardId, setContextCardId] = useState(null)
  const [contextMenuCardPosition, setContextMenuCardPosition] = useState({x: 0, y: 0})
  const [contextMenuGroupPosition, setContextMenuGroupPosition] = useState({x: 0, y: 0})
  const [contextMenuGroupOpen, setContextMenuGroupOpen] = useState(false)
  const [contextGroupId, setContextGroupId] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [dragX, setDragX] = useState(0)

  useEffect(() => {
    const groups = document.getElementsByClassName('group-container')

    if (groups.length > 1) {
      for (const group of groups) {

        group.oncontextmenu = e => {
          e.preventDefault()
          e.stopPropagation()
          onContextMenuGroupClick(e.target.dataset.groupId, e)
        }
      }

    }

    document.querySelector('#kanbanRoot').onmousedown = e => {
      if (e.target.id === "kanbanRoot") {
        setDragX(window.scrollX + e.screenX)
        setDragging(true)
      }
    }

    document.onmouseup = e => {
      setDragging(false)
    }

    document.onmousecancel = e => {
      setDragging(false)
    }

    document.onmousemove = e => {
      if (dragging === true) {
        window.scrollTo(dragX - e.screenX, 0)
      }
    }

  })

  const onAddCard = e => {
    props.onAddCard(e.target.dataset.groupId)
  }

  const onUpdateCardTitle = e => {
    props.onUpdateCard(e.target.dataset.cardId, {title: e.target.value})
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

  const onDragEnd = (e) => {
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
        e.source.index,
        e.destination.index
      )
    }
  }

  const onCardDrop = e => {
    if (e.source.droppableId === e.destination.droppableId) {
      props.onCardOrderUpdate(
        e.draggableId,
        e.source.droppableId,
        e.source.index,
        e.destination.index,
      )
    } else {
      props.onCardGroupUpdate(
        e.draggableId,
        e.destination.droppableId,
        e.destination.index,
      )
    }
  }

  const filterTeams = (id, teams) => {
    const boardRef = props.tree.find(node => node.board === id)
    const parentRef = props.tree.find(node => node._id === boardRef.parent)

    if (parentRef.isRoot === true) {
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="kanban" onClick={onBoardClick}>
      <Droppable droppableId="kanbanRoot" direction="horizontal" type="COLUMN">
        {provided => (
          <div
            id="kanbanRoot"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.groups.map((group, index) =>
            <div className="group">
              <Draggable key={group._id}
                draggableId={group._id}
                index={index} type="COLUMN"
                data-group-id={group._id}
              >
                {dragProvided =>
              <div
                className="group-container"
                ref={dragProvided.innerRef}
                data-group-id={group._id}
                {...dragProvided.draggableProps}
                {...dragProvided.dragHandleProps}
              >
                <div className="group-control"
                  data-group-id={group._id}
                >
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
                  <div
                    data-group-id={group._id}
                    className="column"
                  >
                    <Droppable droppableId={group._id}>
                      {provided2 => (
                      <div
                        className="rbd-droppable-context"
                        data-group-id={group._id}
                        {...provided2.droppableProps}
                        ref={provided2.innerRef}
                      >
                       {
                        props.boards
                        .filter(board => board.group === group._id)
                        .map((column, cardIndex) =>
                          <Card
                            key={column._id}
                            team={props.tree.find(node => node.board === column._id).team}
                            teams={filterTeams(column._id, props.teams)}
                            onCardClick={props.onCardClick}
                            id={column._id}
                            onTeamChange={props.onTeamChange}
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
              </div>
            }
            </Draggable>
          </div>
          )}
          {provided.placeholder}
          <div className="group">
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
          </div>
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
      </div>
    </DragDropContext>
  )
})

export default Kanban

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
