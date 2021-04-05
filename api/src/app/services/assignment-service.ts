import UserRepositoryInterface from '../repositories/user-repository-interface'
import AssignmentRepositoryInterface from '../repositories/assignment-repository-interface'

class AssignmentService {
  private userRepository: UserRepositoryInterface
  private assignmentRepository: AssignmentRepositoryInterface

  constructor(
    userRepository: UserRepositoryInterface,
    assignmentRepository: AssignmentRepositoryInterface,
  ) {
    this.userRepository = userRepository
    this.assignmentRepository = assignmentRepository
  }

  public async createAssignment(sub, assignee, board) {
    try {
      const user = await this.userRepository.findOne({sub: sub})
      const assigner = user._id
      const currentAssignment = await this.assignmentRepository.findOne({
        board: board,
        assignee: assignee,
      })
      
      if (currentAssignment != null) {
        return currentAssignment
      }

      const assignment = await this.assignmentRepository.create(assignee, assigner, board)

      return assignment

    } catch(error) {
      throw error
    }
  }

  public async readAssignments(sub) {
    try {
      const user = await this.userRepository.findOne({sub: sub})
      const assignments = await this.assignmentRepository.findAll({assignee: user._id})
      return assignments
    } catch(error) {
      throw error
    }
  }

  public async deleteAssignment(board, assignee) {
    try {

      const result = await this.assignmentRepository.deleteOne({
        board: board,
        assignee: assignee
      })

      return result

    } catch(error) {
      throw error
    }
  }
}

export default AssignmentService