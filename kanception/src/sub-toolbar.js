import React from 'react'
import CommentIcon from './features/kanban/icon-comment.png'
import { Dropdown, Pagination, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import HamburgerMenu from 'react-hamburger-menu'
import './sub-toolbar.css'

const SubToolbar = props => {
  return (
    <div style={{marginTop: "60px", color: "dodgerblue", display: "flex", position: "fixed"}}>
      {/*<img onClick={props.onCommentsClick} src={CommentIcon} width={"36px"} style={{margin: "10px", objectFit: "scale-down"}}></img>*/}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        margin: "10px",
        marginBottom: "10px",
      }}>
      {
      	props.menuOpen === false &&
      	<div style={{margin: "10px"}}>
          <HamburgerMenu
            color={props.theme.text}
            width={20}
            height={15}
            strokeWidth={3}
            menuClicked={props.onOpen}
            isOpen={false}
          />
        </div>
      }
        
        <Pagination
          style={{marginBottom: "0px",}}
        >
          <Pagination.Prev onClick={props.onBack} />
        </Pagination>
      </div>
      <h6 style={{margin: "10px", display: "flex", alignItems: "center"}}>{props.title}</h6>
    </div>
  )
}

export default SubToolbar