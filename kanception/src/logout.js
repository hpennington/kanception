import React from 'react'
import { useAuth0 } from './react-auth0-spa'

const Logout = () => {
  const { isAuthenticated, logout } = useAuth0()

  return (
    <div style={{
        color: "white"
      }}
    >
        Logout
      {isAuthenticated && logout()}
    </div>
  )
}

export default Logout
