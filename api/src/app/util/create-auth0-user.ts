import fetch from 'node-fetch'
import { uuid } from 'uuidv4'

const createAuth0User = async (email, first, last) => {
  const tokenResult = await fetch(
    'https://kanception.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      "client_id": process.env.AUTH0_CLIENT_ID,
      "client_secret": process.env.AUTH0_CLIENT_SECRET,
      "audience": "https://kanception.auth0.com/api/v2/",
      "grant_type": "client_credentials"
    })
  })

  const accessToken = await tokenResult.json()
  const token = accessToken.access_token

  const auth0UserResult = await fetch('https://kanception.auth0.com/api/v2/users', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      connection: 'Username-Password-Authentication',
      email: email,
      email_verified: true,
      given_name: first,
      family_name: last,
      password: uuid()
    }),
  })
  console.log(auth0UserResult)
  const auth0User = await auth0UserResult.json()
  console.log(auth0User)

  return auth0User
}

export { createAuth0User }