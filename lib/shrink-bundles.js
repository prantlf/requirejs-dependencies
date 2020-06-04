function shrinkBundleDependencies (manyModules, bundles, mainBundle) {
  let singleBundle
  if (Array.isArray(manyModules)) {
    singleBundle = true
    manyModules = { [mainBundle]: manyModules }
  }
  bundles = createBundleSets(bundles)
  const result = {}
  for (const id in manyModules) {
    const bundle = id in manyModules ? id : getParentBundle(id, bundles)
    result[bundle] = getBundleDependents(bundle, manyModules[id], bundles)
  }
  return singleBundle ? result[mainBundle] : result
}

function createBundleSets (bundles) {
  const sets = {}
  for (const bundle in bundles) {
    sets[bundle] = new Set(bundles[bundle])
  }
  return sets
}

function getParentBundle (id, bundles) {
  for (const bundle in bundles) {
    if (bundle === id) return bundle
    const set = bundles[bundle]
    if (set.has(id)) return bundle
  }
  throw new Error(`${id} not found in any bundle`)
}

function getBundleDependents (tracedBundle, modules, bundles) {
  const visited = new Set()
  const traced = []
  for (let module of modules) {
    let { id } = module
    if (id.includes('!')) {
      if (!visited.has(id)) {
        traced.push(module)
        visited.add(id)
      }
      continue
    }
    const bundle = getParentBundle(id, bundles)
    if (bundle !== tracedBundle) {
      id = bundle
      module = { id }
    }
    if (!visited.has(id)) {
      const { dependents } = module
      if (dependents) module.dependents = getDependentBundles(id, dependents, bundles)
      traced.push(module)
      visited.add(id)
    }
  }
  return traced
}

function getDependentBundles (module, dependents, bundles) {
  const visited = new Set()
  const shrunk = []
  for (const dependent of dependents) {
    const bundle = getParentBundle(dependent, bundles)
    if (!visited.has(bundle)) {
      shrunk.push(dependent)
      visited.add(bundle)
    }
  }
  return shrunk
}

module.exports = shrinkBundleDependencies
