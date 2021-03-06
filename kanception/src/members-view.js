import React, { useRef, useState } from 'react'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useAuth0 } from './react-auth0-spa'
import './members-view.css'

const MembersView = props => {
  const [teamInviteOpen, setTeamInviteOpen] = useState(false)
  const { getTokenSilently } = useAuth0()

  const onInviteSubmit = async (first, last, email) => {
    const token = await getTokenSilently()
    fetch(
      process.env.REACT_APP_API + '/team/invite?first='
      + first + '&last=' + last + '&email=' + email + '&team=' + props.team,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => setTeamInviteOpen(false))
     .catch(console.log)

  }

  return (
    <div style={{width: "100%", height: "fit-content", marginBottom: "60px"}}>
      <div className="btn-container">
        <button onClick={e => setTeamInviteOpen(true)}>Invite Team + </button>
      </div>
      {
        teamInviteOpen === true &&
        <InviteTeam  onSubmit={onInviteSubmit} onCancel={e => setTeamInviteOpen(false)} />
      }
      {
        props.members.length > 0 &&
        <div className="members-container">
          {props.members.map(member =>
            <MemberView email={member.email} name={{first: member.firstName, last: member.lastName}} />)}
        </div>
      }
    </div>
  )
}

const TooltipInfo = props => {
  return (
    <div>
      <div>
        {props.name}
      </div>
      <div>
        {props.email}
      </div>
    </div>
  )
}

const MemberView = props => {
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={<Tooltip><TooltipInfo email={props.email} name={displayName(props.name)} /></Tooltip>}
    >
      <div className="member-view">
          <h3>{props.name.first[0].toUpperCase() + props.name.last[0].toUpperCase()}</h3>
      </div>
    </OverlayTrigger>
  )
}

const displayName = ({first, last}) => {
  return  first[0].toUpperCase() + first.slice(1)
    + ' '
    + last[0].toUpperCase() + last.slice(1)
}

const InviteTeam = props => {
  const [submitEnabled, setSubmitEnabled] = useState(false)
  const firstName = useRef(null)
  const lastName = useRef(null)
  const email = useRef(null)

  const nameStyle = {
    margin: "10px",
    borderRadius: "5px",
    border: "solid 1px gray",
  }

  const setEnabled = () => {
    if ((firstName.current.value.length > 0)
      && (lastName.current.value.length > 0)
      && (email.current.value.length > 0)) {
      setSubmitEnabled(true)
    } else {
      setSubmitEnabled(false)
    }
  }

  const onFirstChange = e => {
    setEnabled()
  }

  const onLastChange = e => {
    setEnabled()
  }

  const onEmailChange = e => {
    setEnabled()
  }

  const onSubmit = e => {
    props.onSubmit(
      firstName.current.value,
      lastName.current.value,
      email.current.value,
    )
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(128, 128, 128, 0.25)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      }}>
      <div style={{
        width: "300px",
        height: "300px",
        background: "white",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        }}>
        <p style={{color: "black"}}>Invite team!</p>
        <input
          ref={firstName}
          type="text"
          onChange={onFirstChange}
          placeholder="First"
          style={nameStyle}
        />
        <input
          ref={lastName}
          type="text"
          onChange={onLastChange}
          placeholder="Last"
          style={nameStyle}
        />
        <input
          ref={email}
          type="email"
          onChange={onEmailChange}
          placeholder="Email"
          style={nameStyle}
        />
        <div style={{display: "flex"}}>
          <Button
            style={{margin: "10px"}}
            onClick={props.onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            style={{margin: "10px"}}
            onClick={onSubmit}
            disabled={!submitEnabled}
          >
            Invite
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MembersView
