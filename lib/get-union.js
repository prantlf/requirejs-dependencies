function getUnion (traced) {
  // support both array of dependency arrays (many from traceSingle)
  // and object with keys ponting to dependency arrays (from traceMany)
  if (!Array.isArray(traced)) traced = Object.values(traced)
  const visited = new Set()
  const union = []
  // iterate over traced dependencies of each originating module
  for (const modules of traced) {
    // iterate over traced dependencies
    for (const module of modules) {
      const { id } = module
      // remember each dependency only once, if it was found in more modules
      if (!visited.has(id)) {
        union.push(module)
        visited.add(id)
      }
    }
  }
  return union
}

module.exports = getUnion
