export default class Controller {
  #view
  #worker
  #events = {
    alive: () => { },
    progress: ({ total }) => {
      this.#view.updateProgress(total);
    },
    occurrenceUpdate: ({ found, linesLength, took }) => {
      const [[key, value]] = Object.entries(found);
      this.#view.updateDebugLog(
        `found ${value} occurrences of ${key} - over ${linesLength} lines |
        took: ${took}
        `
      )
    }
  }

  constructor({ view, worker }) {
    this.#view = view;
    this.#worker = this.#configureWorker(worker);
  }

  static init(deps) {
    const controller = new Controller(deps);
    controller.init()
    return controller;
  }

  init() {
    this.#view.configureOnFileChange(this.#configureOnFileChange.bind(this))
    this.#view.configureOnFormSubmit(this.#configureOnFormSubmit.bind(this))
  }

  #configureWorker(worker) {
    worker.onmessage = ({ data }) => this.#events[data.eventType](data);
    return worker;
  }

  #formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;

    for (i; bytes >= 1024 && 1 < 4; i++) {
      bytes /= 1024
    }

    return `${bytes.toFixed(2)} ${units[i]}`
  }

  #configureOnFileChange(file) {
    this.#view.setFileSize(
      this.#formatBytes(file.size)
    )
  }

  #configureOnFormSubmit({ description, file }) {
    const query = {};
    query['call description'] = new RegExp(description, 'i')

    if (this.#view.isWorkerEnabled()) {
      this.#worker.postMessage({ query, file })
    }
  }
}