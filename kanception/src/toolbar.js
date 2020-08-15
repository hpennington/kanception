import React from 'react'
import { Dropdown, Pagination, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import HamburgerMenu from 'react-hamburger-menu'
import './toolbar.css'

const Toolbar = (props) => {
  return (
    <div className="toolbar">
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        margin: "10px",
        marginBottom: "10px",
      }}>
        <Pagination
          style={{marginBottom: "0px",}}
        >
          <Pagination.Prev onClick={props.onBack} />
        </Pagination>
        <div style={{margin: "10px"}}>
          <HamburgerMenu
            color={'white'}
            width={20}
            height={15}
            strokeWidth={3}
            menuClicked={props.onOpen}
            isOpen={false}
          />
        </div>
      </div>
        <ToggleButtonGroup toggle name="main-toggle">
          <ToggleButton
            type="radio"
            variant="secondary"
            name="radio"
            style={{
              boxShadow: "none",
              borderRight: "1px solid #4d27cf",
              background: "white",
              color: props.kanbanOpen === true ? "gray" : "#4d27cf",
            }}
            checked={false}
            onClick={props.onOpenKanban}
          >
            Kanban
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="secondary"
            name="radio"
            style={{
              boxShadow: "none",
              borderLeft: "1px solid #4d27cf",
              background: "white",
              color: props.kanbanOpen === true ? "#4d27cf" : "gray",
            }}
            onClick={props.onOpenGantt}
          >
            Gantt
          </ToggleButton>
      </ToggleButtonGroup>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div style={{marginLeft: "20px"}}>
            <FormControlLabel
              labelPlacement="top"
              control={
                <Switch
                  color="primary"
                  checked={props.darkMode}
                  onChange={props.onDarkModeChange}
                />
              }
              label="Dark Mode"
            />
          </div>
          <Dropdown.Item style={{textAlign: "center"}}href="/logout?returnTo=/">Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Toolbar
