import React from 'react'
import ReactDOM from 'react-dom'
import { Auth0Provider } from './react-auth0-spa'
import history from './utils/history'
import config from './auth_config.json'
import store from './app/store'
import Router from './router'
import { Provider } from 'react-redux'

import './index.css'

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        audience={config.audience}
        redirect_uri={'http://localhost:3000'}
        onRedirectCallback={onRedirectCallback}
      >
        <Router />
      </Auth0Provider>

    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
