const { performance } = require('perf_hooks')
const trace = require('amodro-trace')
const loadConfig = require('./load-config')

function normalizeConfig (config, rootDir) {
  if (!config) config = {}
  if (typeof config === 'string') config = loadConfig(config)
  // Workaround for the CSS plugin, which needs config.dir or config.out set
  // for the module loading phase, not only for the output generation phase.
  if (!config.dir) config.dir = rootDir
  return config
}

function traceSingle ({ module, rootDir, config }) {
  config = normalizeConfig(config, rootDir)
  const start = performance.now()
  return trace({ rootDir, id: module }, config)
    .then(result => {
      result.config = config
      result.time = performance.now() - start
      return result
    })
}

function traceMany ({ modules, rootDir, config }) {
  config = normalizeConfig(config, rootDir)
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
