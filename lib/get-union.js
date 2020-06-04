function getUnion (manyModules) {
  if (!Array.isArray(manyModules)) manyModules = Object.values(manyModules)
  const visited = new Set()
  const traced = []
  for (const modules of manyModules) {
    for (const module of modules) {
      const { id } = module
      if (!visited.has(id)) {
        traced.push(module)
        visited.add(id)
      }
    }
  }
  return traced
}

module.exports = getUnion
