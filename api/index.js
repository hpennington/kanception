const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const { v4: uuidv4 } = require('uuid')
const sendmail = require('sendmail')()
const aws = require('aws-sdk')

aws.config.loadFromPath('./.aws-config.json')

const ObjectId = mongoose.Types.ObjectId
const port = 4000

const app = express()

app.use(cors())
app.use(bodyParser())
app.use(express.json())

const authConfig = {
  domain: 'kanception.auth0.com',
  audience: 'https://kanception.auth0.com/api/v2/',
}

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
  scope: 'openid profile email',
})

app.use(jwtCheck)

const sendPasswordResetEmail = (recipient, url) => {
  // Replace sender@example.com with your "From" address.
  // This address must be verified with Amazon SES.
  const sender = "Kanception.io <verify@kanception.io>"

  // The subject line for the email.
  const subject = "Kanception.io: Verify account and set password"

  // The email body for recipients with non-HTML email clients.
  const body_text = url

  // The HTML body of the email.
  const body_html = `<html>
  <head></head>
  <body>
    <a href="${url}">Verify account</a>
  </body>
  </html>`;

  // The character encoding for the email.
  const charset = "UTF-8";

  // Create a new SES object.
  var ses = new aws.SES();

  // Specify the parameters to pass to the API.
  var params = {
    Source: sender,
    Destination: {
      ToAddresses: [
        recipient
      ],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: charset
      },
      Body: {
        Text: {
          Data: body_text,
          Charset: charset
        },
        Html: {
          Data: body_html,
          Charset: charset
        }
      }
    },
  }

  //Try to send the email.
  ses.sendEmail(params, function(err, data) {
    // If something goes wrong, print an error message.
    if(err) {
      console.log(err.message);
    } else {
      console.log("Email sent! Message ID: ", data.MessageId);
    }
  });
}

mongoose.connect('mongodb://mongo/kanception', {useNewUrlParser: true})
const db = mongoose.connection

const spaceSchema = new mongoose.Schema({
  title: String,
  team: String,
  owner: String,
})

const Space = new mongoose.model('Space', spaceSchema)

const projectSchema = mongoose.Schema({
  title: String,
  space: String,
  owner: String,
})

const Project = new mongoose.model('Project', projectSchema)

const boardSchema = new mongoose.Schema({
  title: String,
  project: String,
  owner: String,
  parent: String,
  group: String,
  order: Number,
  start: Number,
  end: Number,
  count: Number,
  comments: Boolean,
})

const Board = new mongoose.model('Board', boardSchema)

const groupSchema = new mongoose.Schema({
  title: String,
  board: String,
  owner: String,
  order: Number,
})

const Group = new mongoose.model('Group', groupSchema)

const userSchema = new mongoose.Schema({
  email: String,
  sub: String,
  name: {
    first: String,
    last: String,
  },
  spaces: [String],
  active: Boolean,
})

const User = new mongoose.model('User', userSchema)

const teamSchema = new mongoose.Schema({
  members: [String],
})

const Team = new mongoose.model('Team', teamSchema)

const teamInviteSchema = new mongoose.Schema({
  team: String,
  invitee: String,
})

const TeamInvite = new mongoose.model('TeamInvite', teamInviteSchema)

const assignmentSchema = new mongoose.Schema({
  assignee: String,
  assigner: String,
  board: String,
})

const Assignment = new mongoose.model('Assignment', assignmentSchema)

const commentSchema = new mongoose.Schema({
  owner: String,
  board: String,
  text: String,
  timestamp: String,
})

const Comment = new mongoose.model('Comment', commentSchema)

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {

  app.get('/comments', async (req, res) => {
    try {
      const boardId = req.query.board

      const user = await User.findOne({sub: req.user.sub})
      const board = await Board.findById(new ObjectId(boardId))
      const project = await Project.findById(new ObjectId(board.project))
      const space = await Space.findById(new ObjectId(project.space))
      const team = await Team.findById(new ObjectId(space.team))

      if (team.members.includes(user._id)) {
        const comments = await Comment.find({board: boardId})
        res.send(comments.sort((a, b) => a.timestamp < b.timestamp))
      }
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.post('/comments', async (req, res) => {
    try {
      const text = req.query.text
      console.log({text})
      const boardId = req.query.board
      const timestamp = new Date().getTime()

      const user = await User.findOne({sub: req.user.sub})

      const comment = await Comment.create({
        text: text,
        owner: user._id,
        board: boardId,
        timestamp: timestamp,
      })

      const board = await Board.findById(new ObjectId(boardId))
      if (board.comments === false || board.comments === undefined) {
        board.comments = true
        board.save()
      }

      res.send(comment)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/assignments', async (req, res) => {
    try {
      const user = await User.findOne({sub: req.user.sub})
      const assignments = await Assignment.find({assignee: user._id})
      res.send(assignments)
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.post('/assignment', async (req, res) => {
    const user = await User.findOne({sub: req.user.sub})
    const assigner = user._id
    const assignee = req.query.assignee
    const board = req.query.board

    try {

      const currentAssignment = await Assignment.findOne({
        board: board,
        assignee: assignee,
      })

      if (currentAssignment != null) {
        res.send(currentAssignment)
        return
      }

      const assignment = await Assignment.create({
        assignee: assignee,
        assigner: assigner,
        board: board,
      })

      res.send(assignment)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.delete('/assignment', async (req, res) => {
    const board = req.query.board
    const assignee = req.query.assignee

    try {

      const result = await Assignment.deleteOne({
        board: board,
        assignee: assignee
      })

      res.sendStatus(204)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/spaces', async (req, res) => {
    try {

      const owner = await User.findOne({sub: req.user.sub})

      const spaces = []

      for (const spaceId of owner.spaces) {
        console.log('spaceid: ' + spaceId)
        const space = await Space.findById(new ObjectId(spaceId))
        console.log(space)
        spaces.push(space)
      }

      res.send(spaces)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.delete('/space', async (req, res) => {
    const id = req.query.id
    try {

      const user = await User.findOne({sub: req.user.sub})
      const space = await Space.findById(new ObjectId(id))
      const team = await Team.findById(new ObjectId(space.team))

      if (user._id != space.owner) {
        res.sendStatus(401)
        return
      }

      const projects = await Project.find({space: id})

      for (const project of projects) {

        const boards = await Board.find({project: project._id})

        await recursiveDelete(boards.map(board => board._id))

        const result = await Project.deleteOne({_id: project._id})
      }

      for (const member of team.members) {
        const teamMember = await User.findById(new ObjectId(member))
        teamMember.spaces = teamMember.spaces.filter(s => s !== id)
        teamMember.save()
      }

      const result = await Space.deleteOne({_id: id})
      const result2 = await Team.deleteOne({_id: space.team})

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.post('/spaces/add', async (req, res) => {
    try {

      const title = req.query.title
      const owner = await User.findOne({sub: req.user.sub})
      const team = await Team.create({members: [owner._id]})
      const space = await Space.create({title: title, team: team._id, owner: owner._id})

      owner.spaces.push(space._id)
      owner.save()

      res.send(space)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.delete('/project', async (req, res) => {
    try {
      const id = req.query.id
      const owner = await User.findOne({sub: req.user.sub})
      const project = await Project.findOne({_id: id})
      if (owner._id == project.owner) {
        const boards = await Board.find({project: id})
        await recursiveDelete(boards.map(board => board._id))
        const deleteResult = await Project.deleteOne({_id: id})
        res.sendStatus(200)
      } else {
        res.sendStatus(401)
      }

    } catch(error) {
      console.log(error)
      res.send(500)
    }
  })

  app.get('/projects', async (req, res) => {
    try {

      const owner = await User.findOne({sub: req.user.sub})

      const projects = []

      for (const team of owner.spaces) {
        console.log(team)
        const space = await Space.findById(new ObjectId(team))
        console.log(space)
        const projectsResult = await Project.find({space: space._id})
        projects.push(...projectsResult)
      }

      res.send(projects)

    } catch(error) {
      console.log(error)
    }
  })

  app.post('/projects/add', async (req, res) => {
    try {

      const title = req.query.title
      const space = req.query.space

      const owner = await User.findOne({sub: req.user.sub})
      const project = await Project.create({
        title: title,
        space: space,
        owner: owner._id,
      })

      const projectRoot = await Board.create({
        title: title,
        owner: owner._id,
        order: 0,
        parent: null,
        project: project._id,
        group: null,
        count: 0,
        comments: false,
      })

      const groupBacklog = await Group.create({
        title: "Backlog",
        owner: owner._id,
        order: 0,
        board: projectRoot._id,
      })

      const groupTodo = await Group.create({
        title: "To-do",
        owner: owner._id,
        order: 1,
        board: projectRoot._id,
      })

      const groupInProgress = await Group.create({
        title: "In progress",
        owner: owner._id,
        order: 2,
        board: projectRoot._id,
      })

      const groupReview = await Group.create({
        title: "Review",
        owner: owner._id,
        order: 3,
        board: projectRoot._id,
      })

      const groupDone = await Group.create({
        title: "Done",
        owner: owner._id,
        order: 4,
        board: projectRoot._id,
      })

      res.send(project)

    } catch(error) {
      console.log(error)
    }
  })

  app.get('/tree', async (req, res) => {
    try {

      const project = req.query.project
      const owner = await User.findOne({sub: req.user.sub})
      const nodes = await Board.find({project: project})
      const updatedNodes = []

      for (var node of nodes) {
        // Add assignees to board
        const assignments = await Assignment.find({board: node._id})
        const assignees = assignments.map(assignment => assignment.assignee)

        updatedNodes.push({
          _id: node._id,
          assignees: assignees,
          title: node.title,
          project: node.project,
          owner: node.owner,
          parent: node.parent,
          group: node.group,
          order: node.order,
          start: node.start,
          end: node.end,
          count: node.count,
          comments: node.comments,
        })
      }

      res.send(updatedNodes)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/user', async (req, res) => {
    try {
      const user = await User.findOne({sub: req.user.sub})
      res.send(user.spaces)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.post('/user', async (req, res) => {
    console.log(req.user)
    const user = await User.find({sub: req.user.sub})
    const token = req.headers.authorization

    const userEmail = await fetch('https://kanception.auth0.com/userinfo', {
      headers: {
        Authorization: token,
      }
    })
    const email = await userEmail.json()

    console.log(email)
    const userFromEmail = await User.find({email: email.email})

    if (user.length === 0 && userFromEmail.length === 0) {

      const user = await User.create({sub: req.user.sub, spaces: [], active: true})

      res.send(user)
    } else if (user.length === 0 && userFromEmail.length > 0) {
      userFromEmail[0].sub = req.user.sub
      userFromEmail[0].active = true
      userFromEmail[0].save()

      res.send(userFromEmail[0])

    } else {
      res.send(user[0])
    }

  })

  app.post('/team/invite/accept', async (req, res) => {
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
  })

  app.post('/name', async (req, res) => {
    try {

      const users = await User.find({sub: req.user.sub})
      const user = users[0]
      const first = req.query.first
      const last = req.query.last
      const token = req.headers.authorization

      const userEmail = await fetch('https://kanception.auth0.com/userinfo', {
        headers: {
          Authorization: token,
        }
      })

      const email = await userEmail.json()
      console.log(email.email)

      user.name = {
        first: first,
        last: last,
      }


      user.email = email.email

      user.save()

      console.log(user)

      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.post('/team/invite', async (req, res) => {
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
  })

  const resetPassword = async (user_id, email) => {
    console.log({email})
    console.log({user_id})
	  const tokenResult = await fetch(
      'https://kanception.auth0.com/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        "client_id": "DmD1I0eIDD0vq1sDuW96c1pMpyFnjk0e",
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

  const createAuth0User = async (email, first, last) => {
	  const tokenResult = await fetch(
      'https://kanception.auth0.com/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        "client_id": "DmD1I0eIDD0vq1sDuW96c1pMpyFnjk0e",
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

  app.get('/team/root/children', async (req, res) => {
    const team = req.query.team

    try {

      const root = await Board.find({team: team, group: null})

      if (root.length === 0) {
        res.sendStatus(500)
        return
      }

      res.send(root)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/teaminvites', async (req, res) => {
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

  })

  app.delete('/teaminvites', async (req, res) => {
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
  })

  app.get('/profiles', async (req, res) => {
    const team = req.query.team
    try {

      const user = await User.find({sub: req.user.sub})
      if (user.length === 0) {
        res.sendStatus(503)
        return
      }

      const spaceResult = await Space.findById(new ObjectId(team))
      const teamResult = await Team.findById(new ObjectId(spaceResult.team))
      if (teamResult === undefined || teamResult === null) {
        res.sendStatus(502)
        return
      }

      if (teamResult.members.includes(user[0]._id) === false) {
        console.log('members')
        console.log(teamResult.members)
        console.log(user[0]._id)
        res.sendStatus(501)
        return
      }

      const profiles = []

      for (const member of teamResult.members) {
        console.log(member)
        const userObject = await User.findById(new ObjectId(member))

        if (userObject === null || userObject === undefined) {
          res.sendStatus(500)
          return
        }

        profiles.push({
          _id: userObject._id,
          email: userObject.email,
          name: userObject.name,
        })
      }

      res.send(JSON.stringify(profiles))

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/team', async (req, res) => {
    try {
      const owner = await User.findOne({sub: req.user.sub})
      if (owner === null) {
        res.sendStatus(500)
        return
      }

      const space = await Space.findById({_id: req.query.team})
      console.log(space)

      if (owner.spaces.includes(space._id) === false) {
        res.sendStatus(501)
        return
      }

      const team = await Team.findById(new ObjectId(space.team))

      if (team === null) {
        res.sendStatus(502)
        return
      }

      res.send(JSON.stringify(team))

    } catch (error) {
      console.log(error)
      res.sendStatus(503)
    }
  })

  app.post('/team', async (req, res) => {
    try {
      const owner = await User.findOne({sub: req.user.sub})
      if (owner === null) {
        res.sendStatus(500)
      }

      const team = await Team.create({
        owner: owner._id,
        title: req.query.title,
        members: [owner._id]
      })

      owner.spaces.push(team._id)
      owner.save()

      const groupBacklog = await Group.create({title: "Backlog", owner: team._id, order: 0})
      const groupTodo = await Group.create({title: "To-do", owner: team._id, order: 1})
      const groupInProgress = await Group.create({title: "In progress", owner: team._id, order: 2})
      const groupReview = await Group.create({title: "Review", owner: team._id, order: 3})
      const groupDone = await Group.create({title: "Done", owner: team._id, order: 4})

      const groups = [groupBacklog, groupTodo, groupInProgress, groupReview, groupDone]

      const teamRoot = await Board.create({
        title: req.query.title,
        owner: team._id,
        groups: groups.map(group => group._id),
        order: 0,
        parent: null,
        team: team._id,
        group: null,
        isTeamRoot: true,
        isUserRoot: false,
        count: 0,
        comments: false,
      })

      res.send(team)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/groups', async (req, res) => {
    try {
      const boardId = req.query.board_id
      const groups = await Group.find({board: boardId})
      res.send(groups)
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.post('/groups/add', async (req, res) => {
    try {
      const boardId = req.query.board
      const ownerObject = await User.findOne({sub: req.user.sub})
      const owner = ownerObject._id
      const board = await Board.findById(new ObjectId(boardId))
      const currentGroups = await Group.find({board: boardId})
      const order = Math.max(...[-1, ...currentGroups.map(group => group.order)]) + 1
      const group = await Group.create({owner: owner, title: '', order: order, board: boardId})

      res.send(group)
    } catch(error) {
      console.log(error)
    }
  })

  app.post('/groups/update', async (req, res) => {

    try {
      const groupId = req.query.id
      const group = await Group.findById(new ObjectId(groupId))
      const updatedGroup = Object.assign(group, req.body)
      updatedGroup.save()
      res.sendStatus(201)

    } catch(error) {
      res.sendStatus(500)
    }

  })

  app.delete('/groups', async (req, res) => {
    const id = req.query.id

    try {

      const user = await User.findOne({sub: req.user.sub})
      const group = await Group.findById(new ObjectId(id))

      if (group.owner == user._id) {
        const deleteResult = await Group.deleteOne({_id: id})
        const boards = await Board.find({group: id})
        if (boards.length > 0) {
          await recursiveDelete(boards.map(board => board._id))
        }
        res.sendStatus(201)
      } else {
        res.sendStatus(403)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.get('/team/boards', async (req, res) => {
    const ids = req.query.ids

    const boards = []

    if (ids != null) {
      for (const id of ids) {
        const boardRef = await BoardRef.find({board: id})
        const board = await Board.findById(new ObjectId(id))

        boards.push({
          groups: board.groups,
          _id: board._id,
          title: board.title,
          owner: board.owner,
          order: board.order,
          group: boardRef[0].group,
          count: board.count,
        })
      }
    }

    res.send(boards)
  })

  app.get('/boards', async (req, res) => {
    const ids = req.query.ids

    const boards = []

    if (ids != null) {
      const user = await User.find({sub: req.user.sub})
      for (const id of ids) {
        const boardRef = await BoardRef.find({board: id, owner: user[0]._id})
        const board = await Board.findById(new ObjectId(id))

        // Add assignees to board
        const assigments = await Assignment.find({board: id})
        const assignees = assignments.map(assignment => assignment.assignee)

        boards.push({
          groups: board.groups,
          _id: board._id,
          title: board.title,
          owner: board.owner,
          order: board.order,
          group: boardRef[0].group,
          count: board.count,
          assignees: assignees,
        })
      }
    }

    res.send(boards)
  })

  app.delete('/boards', async (req, res) => {
    const id = req.query.id

    try {

      const user = await User.findOne({sub: req.user.sub})
      const board = await Board.findById(new ObjectId(id))

      console.log(board.owner)
      console.log(user._id)
      if (board.owner == user._id) {
        if (board.parent !== null) {
          await recursiveUpdateCount(board.parent, -1)
        }

        await recursiveDelete([id])

        res.sendStatus(201)
      } else {
        res.sendStatus(403)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  const recursiveDelete = async ids => {
    for (const id of ids) {
      const deleteAssignementsResult = await Assignment.deleteMany({board: id})
      const deleteCommentsResult = await Comment.deleteMany({board: id})
      const deleteResult = await Board.deleteOne({_id: new ObjectId(id)})
      const children = await Board.find({parent: id})
      const childrenIds = children.map(child => child._id)
      if (childrenIds.length > 0) {
        recursiveDelete(childrenIds)
      } else {
        return
      }
    }
  }

  app.post('/board/update', async (req, res) => {

    try {
      const boardId = req.query.id
      const board = await Board.findById(new ObjectId(boardId))
      const updatedBoard = Object.assign(board, req.body)
      console.log('updatedboard: ' + board)
      updatedBoard.save()
      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }

  })

  app.post('/boardrefs/update', async (req, res) => {

    try {
      const boardId = req.query.id
      const user = await User.find({sub: req.user.sub})
      const board = await BoardRef.find({board: boardId, owner: user[0]._id})
      const updatedBoard = Object.assign(board[0], req.body)
      updatedBoard.save()
      res.sendStatus(201)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }

  })

  app.post('/boards/add', async (req, res) => {
    try {

      const project = req.query.project
      const group = req.query.group
      const parent = req.query.parent

      const owner = await User.findOne({sub: req.user.sub})

      const boards = await Board.find({group: group})
      const order = Math.max(...[-1, ...boards.map(board => board.order)]) + 1

      const board = await Board.create({
        title: "",
        owner: owner._id,
        order: order,
        project: project,
        parent: parent,
        group: group,
        count: 0,
        comments: false,
      })

      const groupBacklog = await Group.create({
        title: "Backlog",
        owner: owner._id,
        order: 0,
        board: board._id,
      })

      const groupTodo = await Group.create({
        title: "To-do",
        owner: owner._id,
        order: 1,
        board: board._id,
      })

      const groupInProgress = await Group.create({
        title: "In progress",
        owner: owner._id,
        order: 2,
        board: board._id,
      })

      const groupReview = await Group.create({
        title: "Review",
        owner: owner._id,
        order: 3,
        board: board._id,
      })

      const groupDone = await Group.create({
        title: "Done",
        owner: owner._id,
        order: 4,
        board: board._id,
      })

      const groups = [
        groupBacklog,
        groupTodo,
        groupInProgress,
        groupReview,
        groupDone
      ]

      await recursiveUpdateCount(parent, 1)

      res.send(board)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  const recursiveUpdateCount = async (id, amount) => {
    try {

      let currentId = id
      do {

        const board = await Board.findById(new ObjectId(currentId))
        await board.update({$inc: {count: amount}})
        board.save()
        console.log({board})

        currentId = board.parent

       } while(currentId !== null)

    } catch(error) {
      console.log(error)
      throw error
    }
  }

  app.post('/team/board/accept', async (req, res) => {
    const board = req.query.board
    const parent = req.query.parent
    const team = req.query.team
    const group = req.query.group

    try {

      const user = await User.find({sub: req.user.sub})

      if (user.length === 0) {
        res.sendStatus(500)
        return
      }

      const checkBoardRefExists = await BoardRef.find({board: board, owner: user[0]._id})
      if (checkBoardRefExists.length > 0) {
        res.sendStatus(409)
        return
      }

      const boardRef = await BoardRef.create({
        board: board,
        owner: user[0]._id,
        parent: parent,
        team: team,
        group: group,
        isUserRoot: false,
        isTeamRoot: false,
      })

      res.send(boardRef)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  })

  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
})
