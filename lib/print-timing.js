const formatMilliseconds = require('./format-milliseconds')

function printTiming (modules, time) {
  const prefix = modules.length > 1 ? `${modules.length} modules` : modules[0]
  process.stderr.write(`${prefix} traced in ${formatMilliseconds(time)}
`)
}

module.exports = printTiming
