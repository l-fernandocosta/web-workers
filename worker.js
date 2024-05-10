import Service from "./src/service.js";

postMessage('[worker]: ready for connections')
postMessage({ eventType: 'alive' })

const service = new Service();

onmessage = ({ data }) => {
  const { query, file } = data;

  service.processFile({
    query,
    file,
    onOccurrenceUpdate: (args) => {
      postMessage({ eventType: 'occurrenceUpdate', ...args })
    },
    onProgress: (total) => {
      postMessage({ eventType: 'progress', total })
    }
  })

}