const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const User = require('../models/user')
const Team = require('../models/team')
const Comment = require('../models/comment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class CommentService {
  public async createComment(text, boardId, sub) {
    try {
      const timestamp = new Date().getTime()

      const user = await User.findOne({sub: sub})

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

      return comment 
    } catch(error) {
      throw error
    }
  }

  public async readComments(sub, boardId) {
    try {
      const user = await User.findOne({sub: sub})
      const board = await Board.findById(new ObjectId(boardId))
      const project = await Project.findById(new ObjectId(board.project))
      const space = await Space.findById(new ObjectId(project.space))
      const team = await Team.findById(new ObjectId(space.team))

      if (team.members.includes(user._id)) {
        const comments = await Comment.find({board: boardId})
        return comments.sort((a, b) => a.timestamp < b.timestamp)
      }

      return null
    } catch(error) {
      throw error
    }
  }
}

export default CommentService