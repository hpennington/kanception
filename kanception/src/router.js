import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './private-route'

import App from './App'
import Login from './login'
import Logout from './logout'

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/logout' component={Logout} />
        <PrivateRoute path='/' component={App} />
      </Switch>
    </Router>
  )
}

export default AppRouter
