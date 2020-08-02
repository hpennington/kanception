const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

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
})

const Board = new mongoose.model('Board', boardSchema)

mongoose.connect('mongodb://mongo/kanception', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', async () => {

  const countChildren = async (root) => {
    const queue = []
    var sum = 0
    const children = await Board.find({parent: root})
    const childrenIds = children.map(child => child._id)

    if (childrenIds.length > 0) {
      queue.push(...childrenIds)
    }


    while (queue.length > 0) {
      sum += 1


      const id = queue.shift()
      const boards = await Board.find({parent: id})
      const ids = boards.map(board => board._id)

      if (ids.length > 0) {
        queue.push(...ids)

      }
    }

    return sum
  }

  try {

    const boards = await Board.find()

    for (const board of boards) {
      const sum = await countChildren(board._id)
      console.log({sum})
      await board.update({count: sum})
      board.save()
    }

    console.log('success!')

  } catch(error) {
    console.log(error)
  }

})


