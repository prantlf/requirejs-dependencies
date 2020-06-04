function getIntersection (manyModules) {
  if (!Array.isArray(manyModules)) manyModules = Object.values(manyModules)
  const visited = new Map()
  for (const modules of manyModules) {
    for (const module of modules) {
      const { id } = module
      const item = visited.get(id)
      if (item) ++item.occurrences
      else visited.set(id, { module, occurrences: 1 })
    }
  }
  const countOfMany = manyModules.length
  const traced = []
  for (const [, item] of visited) {
    if (item.occurrences === countOfMany) {
      traced.push(item.module)
    }
  }
  return traced
}

module.exports = getIntersection
