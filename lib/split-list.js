function splitList (string) {
  return string ? string.trim().split(/\s*,\s*/) : []
}

module.exports = splitList
