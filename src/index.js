import View from './view.js'
import Controller from './controller.js'

// worker modules only work at chrome
const worker = new Worker('./src/worker.js', {
  type: 'module'
})

Controller.init({
  view: new View(),
  worker
})