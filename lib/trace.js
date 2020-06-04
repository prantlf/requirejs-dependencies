const { readFileSync } = require('fs')
const { performance } = require('perf_hooks')
const trace = require('amodro-trace')

function loadConfig (path) {
  const content = readFileSync(path, 'utf-8')
  // eslint-disable-next-line no-unused-vars
  const require = { config: input => (config = input) }
  let config
  // eslint-disable-next-line no-eval
  eval(content)
  return config
}

function traceSingle ({ module, rootDir, config }) {
  if (!config) config = {}
  if (typeof config === 'string') config = loadConfig(config)
  if (!config.dir) config.dir = rootDir
  const start = performance.now()
  return trace({ rootDir, id: module }, config)
    .then(result => {
      result.config = config
      result.time = performance.now() - start
      return result
    })
}

function traceMany ({ modules, rootDir, config }) {
  if (!config) config = {}
  if (typeof config === 'string') config = loadConfig(config)
  if (!config.dir) config.dir = rootDir
  const start = performance.now()
  return Promise
    .all(modules.map(module => trace({ rootDir, id: module }, config)))
    .then(results => {
      const traced = {}
      const result = { traced, time: performance.now() - start }
      for (let i = 0, l = modules.length; i < l; ++i) {
        traced[modules[i]] = results[i].traced
      }
      return result
    })
}

module.exports = { traceSingle, traceMany }
