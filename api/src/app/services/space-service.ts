const Space = require('../models/space')
const Project = require('../models/project')
const Board = require('../models/board')
const Group = require('../models/group')
const User = require('../models/user')
const Team = require('../models/team')
const mongoose = require('mongoose')
import MongoBoardRepository from '../repositories/mongo/board-repository'
import MongoUserRepository from '../repositories/mongo/user-repository'
import MongoGroupRepository from '../repositories/mongo/group-repository'
import MongoAssignmentRepository from '../repositories/mongo/assignment-repository'
import MongoCommentRepository from '../repositories/mongo/comment-repository'
import BoardService from '../services/board-service'
const ObjectId = mongoose.Types.ObjectId

class SpaceService {
  private boardService: BoardService

  constructor() {
    const boardRepository = new MongoBoardRepository()
    const userRepository = new MongoUserRepository()
    const groupRepository = new MongoGroupRepository()
    const assignmentRepository = new MongoAssignmentRepository()
    const commentRepository = new MongoCommentRepository()
    const boardService = new BoardService(
      boardRepository, 
      userRepository, 
      groupRepository, 
      assignmentRepository, 
      commentRepository
    )

    this.boardService = boardService
  }

  public async createSpace(sub, title) {
    try {
      const owner = await User.findOne({sub: sub})
      const team = await Team.create({members: [owner._id]})
      const space = await Space.create({title: title, team: team._id, owner: owner._id})

      owner.spaces.push(space._id)
      owner.save()

      return space

    } catch(error) {
      throw error
    }
  }

  public async readSpaces(sub) {
  	try {

  	  const owner = await User.findOne({sub: sub})

  	  const spaces = []

  	  for (const spaceId of owner.spaces) {
  	    const space = await Space.findById(new ObjectId(spaceId))
  	    spaces.push(space)
  	  }

  	  return spaces

  	} catch(error) {
  	  throw error
  	}
  }

  public async deleteSpace(sub, id) { 
    try {

      const user = await User.findOne({sub: sub})
      const space = await Space.findById(new ObjectId(id))
      const team = await Team.findById(new ObjectId(space.team))

      if (user._id != space.owner) {
        
        return false
      }

      const projects = await Project.find({space: id})

      for (const project of projects) {

        const boards = await Board.find({project: project._id})

        await this.boardService.recursiveDelete(boards.map(board => board._id))

        const result = await Project.deleteOne({_id: project._id})
      }

      for (const member of team.members) {
        const teamMember = await User.findById(new ObjectId(member))
        teamMember.spaces = teamMember.spaces.filter(s => s !== id)
        teamMember.save()
      }

      const result = await Space.deleteOne({_id: id})
      const result2 = await Team.deleteOne({_id: space.team})

      return true
    } catch(error) {
      throw error
    }
  }
}

export default SpaceService