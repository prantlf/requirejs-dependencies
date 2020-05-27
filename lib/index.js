const { readFileSync } = require('fs')
const { performance } = require('perf_hooks')
const trace = require('amodro-trace')

function traceDependencies ({ module, rootDir, config }) {
  if (!config) config = {}
  if (typeof config === 'string') config = loadConfig(config)
  if (!config.dir) config.dir = rootDir
  const start = performance.now()
  return trace({ rootDir, id: module }, config)
    .then(result => {
      result.time = performance.now() - start
      return result
    })
}

function loadConfig (path) {
  const content = readFileSync(path, 'utf-8')
  // eslint-disable-next-line no-unused-vars
  const require = { config: input => (config = input) }
  let config
  // eslint-disable-next-line no-eval
  eval(content)
  return config
}

module.exports = traceDependencies
