import GroupService from '../services/group-service'

class GroupController {
  private groupService: GroupService
  
  constructor() {
    this.groupService = new GroupService()

    this.createGroup = this.createGroup.bind(this)
    this.readGroups = this.readGroups.bind(this)
    this.updateGroup = this.updateGroup.bind(this)
    this.deleteGroup = this.deleteGroup.bind(this)
  }

  public async createGroup(req, res) {
    try {
      const boardId = req.query.board
      const sub = req.user.sub
      
      const group = await this.groupService.createGroup(sub, boardId)

      res.send(group)
    } catch(error) {
      console.log(error)
    }
  }

  public async readGroups(req, res) {
    try {
      const boardId = req.query.board_id
      const groups = await this.groupService.readGroups(boardId)
      res.send(groups)
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  public async updateGroup(req, res) {
    try {
      const groupId = req.query.id
      const body = req.body
      const group = await this.groupService.updateGroup(groupId, body)
      res.sendStatus(201)

    } catch(error) {
      res.sendStatus(500)
    }

  }

  public async deleteGroup(req, res) {
    const id = req.query.id
    const sub = req.user.sub

    try {

      const result = await this.groupService.deleteGroup(sub, id)

      if (result === true) {
        res.sendStatus(201)
      } else {
        res.sendStatus(403)
      }

    } catch(error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

export default GroupController