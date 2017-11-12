
const { EventEmitter } = require('events')


class Queue extends EventEmitter {
  constructor() {
    super()
    this.list = []
    this.results = []

    // event NEXT
    this.on('next', () => {
      if (this.list.length === 0) {
        this.emit('finish')
        return
      }

      const task = this.list.shift()

      this.emit('before', task)

      // run task callback
      const prom = task.callback()
        .then((result) => {
          this.emit('after', task, result)
          this.next()
        })
        .catch((error) => {
          this.emit('error', error)
        })
    })

    // event AFTER
    this.on('after', (task, result) => {
      this.results.push(result)
    })
  }

  finish() {
    this.emit('finish', this.results)
  }

  next() {
    if (this.list.length !== 0) {
      this.emit('next')
    }
    else {
      this.finish()
    }
  }

  push(task) {
    this.list.push(task)
  }

  start() {
    this.emit('start', this.list[0], this.list)
    this.emit('next')
  }
}


function enqueue(taskList, apply) {
  const queue = new Queue()

  if (apply) apply(queue)

  taskList.forEach(task => queue.push(task))

  return new Promise((resolve, reject) => {
    queue.on('error', reject)
    queue.on('finish', resolve)
    queue.start()
  })
}

exports.Queue = Queue
exports.enqueue = enqueue

// enqueue([
//   { id: 1, callback: () => Promise.resolve(1) },
//   { id: 2, callback: () => Promise.resolve(2) },
//   { id: 3, callback: () => new Promise(resolve => setTimeout(_ => resolve(3), 300)) },
//   { id: 4, callback: () => new Promise(resolve => setTimeout(_ => resolve(4), 300)) },
//   { id: 5, callback: () => new Promise(resolve => setTimeout(_ => resolve(5), 100)) },
//   { id: 6, callback: () => new Promise(resolve => setTimeout(_ => resolve(6), 300)) },
//   { id: 7, callback: () => Promise.resolve(7) },
// ], q => {
//   q.on('before', task => console.log(task.id, 'before'));
//   q.on('after', task => console.log(task.id, 'after'));
// })
// .then(res => console.log('success:', res))
// .catch(error => console.error('fail:', error));


// --- enqueue ---
//
// % start ( [task, ...] )
// % before ( task )
// > run task
// % after ( task, result )
// ...
// % finish ( [result, ...] )
//
