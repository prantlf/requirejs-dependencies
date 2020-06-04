const { readFileSync } = require('fs')

function loadConfig (path) {
  const content = readFileSync(path, 'utf-8')
  // eslint-disable-next-line no-unused-vars
  const require = { config: input => (config = input) }
  let config
  // execute require.config and remember its argument
  eval(content) // eslint-disable-line no-eval
  return config
}

module.exports = loadConfig
