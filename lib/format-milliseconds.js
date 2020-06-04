const formatNumber = require('./format-number')

function formatMilliseconds (duration) {
  // perf_hooks return milliseconds as float, leave only three decimal places
  duration = Math.round(duration * 1000) / 1000
  return `${formatNumber(duration)}ms`
}

module.exports = formatMilliseconds
