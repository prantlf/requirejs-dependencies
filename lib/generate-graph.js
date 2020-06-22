const { digraph } = require('graphviz-builder')

function mergeDefaults (defaults, options) {
  if (options) {
    for (const name in options) {
      const value = options[name]
      if (value !== undefined) defaults[name] = value
    }
  }
  return defaults
}

function completeOptions (options) {
  return {
    G: mergeDefaults({
      overlap: false,
      pad: 0.3,
      rankdir: 'LR',
      layout: 'dot',
      bgcolor: '#111111'
    }, options.G),
    E: mergeDefaults({
      color: '#757575'
    }, options.E),
    N: mergeDefaults({
      fontname: 'Arial',
      fontsize: 14,
      color: '#c6c5fe',
      shape: 'box',
      style: 'rounded',
      height: 0,
      fontcolor: '#c6c5fe'
    }, options.N)
  }
}

function setNodeColor (node, color) {
  node.set('color', color)
  node.set('fontcolor', color)
}

function fillGraph (graph, modules, options) {
  const nodes = new Map()
  const directs = graph.addCluster('cluster')
  directs.set('bgcolor', '#333333')
  for (const module in modules) {
    const dependencies = modules[module]
    let node
    if (options.clusterDirects) {
      node = directs.addNode(module)
      nodes.set(module, node)
    } else {
      node = getOrCreateNode(module)
    }
    if (options.emphasizeDirects) {
      setNodeColor(node, '#79d7fc')
    } else {
      if (!dependencies.length) setNodeColor(node, '#cfffac')
    }
    for (const dependency of dependencies) {
      const dependencyNode = getOrCreateNode(dependency)
      if (!modules[dependency]) setNodeColor(dependencyNode, '#cfffac')
      graph.addEdge(node, dependencyNode)
    }
  }

  function getOrCreateNode (module) {
    let node = nodes.get(module)
    if (!node) {
      node = graph.addNode(module)
      nodes.set(module, node)
    }
    return node
  }
}

function configureGraph (graph, options) {
  const { G, N, E } = options
  for (const name in G) graph.set(name, G[name])
  for (const name in N) graph.setNodeAttribut(name, N[name])
  for (const name in E) graph.setEdgeAttribut(name, E[name])
}

function generateGraph (modules, options = {}) {
  const graph = digraph('G')
  fillGraph(graph, modules, options)
  configureGraph(graph, completeOptions(options))
  return graph
}

module.exports = generateGraph
