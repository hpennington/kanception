import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Group from './group'
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
              <Group
                group={group}
                index={index}
                boards={props.boards}
                tree={props.tree}
                teams={props.teams}
                setContextCardId={setContextCardId}
                contextMenuCardOpen={contextMenuCardOpen}
                onAddCard={props.onAddCard}
                onUpdateCard={props.onUpdateCard}
                onCardClick={props.onCardClick}
              />
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
