const BoardService = require('../services/board-service')
import MongoBoardRepository from '../repositories/mongo-board-repository'
import MongoUserRepository from '../repositories/mongo-user-repository'
import MongoGroupRepository from '../repositories/mongo-group-repository'
import MongoAssignmentRepository from '../repositories/mongo-assignment-repository'

const readTree = async (req, res) => {
  try {

    const project = req.query.project
    const sub = req.user.sub

    const boardRepository = new MongoBoardRepository()
    const userRepository = new MongoUserRepository()
    const groupRepository = new MongoGroupRepository()
    const assignmentRepository = new MongoAssignmentRepository()
    const boardService = new BoardService(boardRepository, userRepository, groupRepository, assignmentRepository)

    const nodes = await boardService.readTree(sub, project)

    console.log({nodes})

    res.send(nodes)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { readTree }