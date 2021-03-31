const BoardService = require('../services/board-service')

const readTree = async (req, res) => {
  try {

    const project = req.query.project
    const sub = req.user.sub

    const nodes = await new BoardService().readTree(sub, project)

    console.log({nodes})

    res.send(nodes)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = { readTree }