const User = require('../models/user')
import Assignment from '../models/assignment'
import AssignmentService from '../services/assignment-service'

class AssignmentController {
  private assignmentService: AssignmentService

  constructor() {
    this.assignmentService = new AssignmentService()

    this.createAssignment = this.createAssignment.bind(this)
    this.readAssignments = this.readAssignments.bind(this)
    this.deleteAssignment = this.deleteAssignment.bind(this)  
  }

  public async createAssignment(req, res) {
    
    const assignee = req.query.assignee
    const board = req.query.board
    const sub = req.user.sub

    try {

      const assignment = await this.assignmentService.createAssignment(sub, assignee, board)
      res.send(assignment)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async readAssignments(req, res) {
    try {
      const sub = req.user.sub
      const assignments = await this.assignmentService.readAssignments(sub)
      res.send(assignments)
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async deleteAssignment(req, res) {
    const board = req.query.board
    const assignee = req.query.assignee

    try {

      const result = await this.assignmentService.deleteAssignment(board, assignee)

      res.sendStatus(204)

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default AssignmentController