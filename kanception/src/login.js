import React from 'react'
import { useAuth0 } from './react-auth0-spa'

const Login = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}
    </div>
  )
}

export default Login
