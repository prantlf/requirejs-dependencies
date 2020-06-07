const dot2svg = require('@aduh95/viz.js/async')
const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)

// function renderImage (graph, options) {
//   return new Promise((resolve, reject) =>
//     graph.render(options, resolve, (code, output, message) =>
//       reject(new Error(message))));
// }

async function renderGraph (graph, imagePath) {
  // const image = await renderImage(graph, completeOptions(options));
  const dot = graph.to_dot()
  if (imagePath && imagePath.endsWith('.dot')) return writeFile(imagePath, dot)
  const image = await dot2svg(dot)
  if (imagePath) return writeFile(imagePath, image)
  return { dot, image }
}

module.exports = renderGraph
