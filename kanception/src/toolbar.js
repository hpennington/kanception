import React from 'react'
import { Dropdown } from 'react-bootstrap'
import HamburgerMenu from 'react-hamburger-menu'
import './toolbar.css'

export default function Toolbar(props) {
  return (
    <div className="toolbar">
      <div style={{margin: "10px"}}>
        <HamburgerMenu
          color={'white'}
          width={20}
          height={20}
          strokeWidth={3}
        />
      </div>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="/logout">Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
