import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const TeamTitleMenu = props => {
  const [disabled, setDisabled] = useState(true)
  const onTitleChange = e => {
    if (e.target.value.length > 0) {
      setDisabled(false)
    } else if (e.target.value.length === 0) {
      setDisabled(true)
    }
  }

  return (
    <div style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255, 255, 255, 0.25)",
        zIndex: 101,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div style={{
          width: "300px",
          height: "150px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "5px",
        }}>
        <input
          style={{
            border: "solid 1px purple",
            borderRadius: "10px",
            margin: "20px",
            width: "80%",
            textAlign: "center",
            }}
          id="team-title-input"
          onChange={onTitleChange}
          type="text" placeholder="Add team title"></input>
          <div>
            <Button
              variant="secondary"
              style={{margin: "10px", width: "80px"}}
              onClick={e => props.close()}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={disabled}
              style={{margin: "10px", width: "80px"}}
              onClick={e => props.onSave(document.getElementById("team-title-input").value)}
            >
              Save
            </Button>
          </div>
      </div>
    </div>
  )
}

export { TeamTitleMenu }
