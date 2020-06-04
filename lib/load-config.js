const { readFileSync } = require('fs')

function loadConfig (path) {
  const content = readFileSync(path, 'utf-8')
  // eslint-disable-next-line no-unused-vars
  const require = { config: input => (config = input) }
  let config
  // eslint-disable-next-line no-eval
  eval(content)
  return config
}

module.exports = loadConfig
