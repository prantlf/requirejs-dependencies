const formatNumber = require('./format-number')

function formatMilliseconds (duration) {
  duration = Math.round(duration * 1000) / 1000
  return `${formatNumber(duration)}ms`
}

module.exports = formatMilliseconds
