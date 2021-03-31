const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const TeamInvite = require('../models/team-invite')
const Assignment = require('../models/assignment')
const Comment = require('../models/comment')
const fetch = require('node-fetch')

const createAuth0User = async (email, first, last) => {
  const tokenResult = await fetch(
    'https://kanception.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      "client_id": "",
      "client_secret": "",
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
      password: uuidv4()
    }),
  })
  console.log(auth0UserResult)
  const auth0User = await auth0UserResult.json()
  console.log(auth0User)

  return auth0User
}

const resetPassword = async (user_id, email) => {
  console.log({email})
  console.log({user_id})
  const tokenResult = await fetch(
    'https://kanception.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      "client_id": "",
      "client_secret": "",
      "audience": "https://kanception.auth0.com/api/v2/",
      "grant_type": "client_credentials"
    })
  })

  const accessToken = await tokenResult.json()
  const token = accessToken.access_token

  const resetPasswordResult =
    await fetch('https://kanception.auth0.com/api/v2/tickets/password-change?email=' + email, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: user_id,
    }),
  })

  console.log('sent reset password email')
  const resetPassword = await resetPasswordResult.json()
  console.log({resetPassword})

  sendPasswordResetEmail(email, resetPassword.ticket)
}

const readTeamInvites = async (req, res) => {
  try {
    console.log(req.user)
    const user = await User.find({sub: req.user.sub})
    const invites = await TeamInvite.find({invitee: user[0]._id})

    const returnResult = []
    for (const invite of invites) {
      console.log(invite)
      const spaceResult = await Space.findById(new ObjectId(invite.team))
      const result = await Team.findById(new ObjectId(spaceResult.team))
      console.log(result)
      returnResult.push(result)
    }

    res.send(returnResult)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }

}

const createTeamInvite = async (req, res) => {
  const first = req.query.first
  const last = req.query.last
  const email = req.query.email
  const team = req.query.team

  console.log({email})

  try {
    const user = await User.findOne({email: email})
    const spaceRecord = await Space.findById(new ObjectId(team))
    const teamRecord = await Team.findById(new ObjectId(spaceRecord.team))

    if (teamRecord === null || teamRecord === undefined) {
      console.log('teamRecord is null')
      res.sendStatus(500)
      return
    }

    // If the user exists
    if (user != null) {

      // Check if user is already a member.

      if (teamRecord.members.includes(user._id) === true) {
        res.sendStatus(409)

        // Else user is not a member
      } else {

        // Check if invitation already exists
        const invitation = await TeamInvite.findOne({invitee: user._id})
        if (invitation !== null && invitation !== undefined) {
          // Create auth0 user
          const auth0User = await createAuth0User(email, first, last)
          console.log({user: req.user})
          if (auth0User.status !== 200) {
            const token = req.headers.authorization
            const userInfo = await fetch('https://kanception.auth0.com/userinfo', {
              headers: {
                Authorization: token,
              }
            })


            const info = await userInfo.json()
            console.log({email})
            console.log({info: info})

            await resetPassword(info.sub, email)
            res.sendStatus(201)
          } else {
            // Send password reset email
            console.log({email})
            console.log({auth0User})
            await resetPassword(auth0User.user_id, email)
            res.sendStatus(201)
          }

        // Else invitation doesn't exist
        } else {

          // Create invitaion
          const invite = await TeamInvite.create({
            team: team,
            invitee: user._id
          })

          // Create auth0 user
          const auth0User = await createAuth0User(email, first, last)

          // Send invite email
          await resetPassword(auth0User.user_id, auth0User.email)
          res.sendStatus(201)
        }

      }


    // Else the user does not exist
    } else {
      const invitedUser = await User.create(
        {name: {
          first: first,
          last: last
        }, email: email,
          active: false,
          spaces: []
      })

      const invite = await TeamInvite.create({
        team: team,
        invitee: invitedUser._id
      })

      const auth0User = await createAuth0User(email, first, last)
      if (auth0User.status !== 200) {

        console.log(req.user)

        const token = req.headers.authorization
        const userInfo = await fetch('https://kanception.auth0.com/userinfo', {
          headers: {
            Authorization: token,
          }
        })

        const info = await userInfo.json()
        console.log({info: info})

        await resetPassword(info.sub, email)
        res.sendStatus(201)
      } else {
        await resetPassword(auth0User.user_id, auth0User.email)
        res.sendStatus(201)
      }

    }

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}
const updateTeamInviteAccept = async (req, res) => {
  try {
    const team = req.query.team
    console.log(team)
    const user = await User.find({sub: req.user.sub})
    if (user.length === 0) {
      res.sendStatus(504)
      return
    }

    console.log(team)
    const space = await Space.findOne({team: team})

    const teamInvite = await TeamInvite
      .find({team: space._id, invitee: user[0]._id})

    if (teamInvite.length === 0) {
      res.sendStatus(503)
      return
    }

    user[0].spaces.push(space._id)
    user[0].save()

    const teamResult = await Team.findById(new ObjectId(team))

    if (teamResult === null || teamResult === undefined) {
      res.sendStatus(503)
      return
    }

    teamResult.members.push(user[0]._id)
    teamResult.save()

    const result = await TeamInvite
      .deleteOne({invitee: user[0]._id, team: space._id})

    res.sendStatus(201)

  } catch(error) {
    console.log(error)
    res.sendStatus(501)
  }
}

const deleteInvite = async (req, res) => {
  try {
    const team = req.query.team
    const user = await User.find({sub: req.user.sub})

    if (user.length === 0) {
      res.sendStatus(500)
      return
    }

    const space = await Space.findOne({team: team})
    const result = await TeamInvite
      .deleteOne({invitee: user[0]._id, team: space._id})

    console.log(result)

    res.sendStatus(200)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { createTeamInvite, readTeamInvites, updateTeamInviteAccept, deleteInvite }