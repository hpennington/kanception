const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const TeamInvite = require('../models/team-invite')
const Assignment = require('../models/assignment')
const Comment = require('../models/comment')

const readTree = async (req, res) => {
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
        description: node.description,
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
}

module.exports = { readTree }