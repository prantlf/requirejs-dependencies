function getIntersection (traced) {
  // support both array of dependency arrays (many from traceSingle)
  // and object with keys ponting to dependency arrays (from traceMany)
  if (!Array.isArray(traced)) traced = Object.values(traced)
  const visited = new Map()
  // iterate over traced dependencies of each originating module
  for (const modules of traced) {
    // iterate over traced dependencies
    for (const module of modules) {
      const { id } = module
      const item = visited.get(id)
      // if the module was seen for the first time, remeber it with the count
      // of occurrences 1, otherwise increment the count by one
      if (item) ++item.occurrences
      else visited.set(id, { module, occurrences: 1 })
    }
  }
  const tracedLength = traced.length
  const intersection = []
  for (const [, item] of visited) {
    // remember only dependencies traced in each of the originating modules
    if (item.occurrences === tracedLength) {
      intersection.push(item.module)
    }
  }
  return intersection
}

module.exports = getIntersection
