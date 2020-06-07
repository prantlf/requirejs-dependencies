const { createGraph, configureGraphviz } = require('./graph-support')
const dot2svg = require('@aduh95/viz.js/async')
const { readFileSync } = require('fs')
const { Suite } = require('benchmark')

const tree = JSON.parse(readFileSync(`${__dirname}/example.json`, 'utf-8'))
const graph = createGraph(tree)
const dot = graph.to_dot()
const options = configureGraphviz()

function renderWithExec (deferred) {
  graph.render(options, () => deferred.resolve(), (code, output, message) =>
    deferred.reject(new Error(message)))
}

function renderWithWasm (deferred) {
  dot2svg(dot).then(() => deferred.resolve(), error => console.error(error))
}

const suite = new Suite()
console.log('generate-graph:')
suite
  .add('exec', renderWithExec, { defer: true })
  .add('wasm', renderWithWasm, { defer: true })
  .on('cycle', ({ target }) => console.log(`  ${String(target)}`))
  .on('complete', () => console.log(`  fastest is ${suite.filter('fastest').map('name')}`))
  .run({ async: true })
