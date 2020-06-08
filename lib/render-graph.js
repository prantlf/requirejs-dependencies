const dot2svg = require('@aduh95/viz.js/async')
const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)

async function renderGraph (graph, imagePath) {
  const dot = graph.to_dot()
  if (imagePath && imagePath.endsWith('.dot')) return writeFile(imagePath, dot)
  const image = await dot2svg(dot)
  if (imagePath) return writeFile(imagePath, image)
  return { dot, image }
}

module.exports = renderGraph
