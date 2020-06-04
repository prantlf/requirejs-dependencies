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
    result[bundle] = getBundleDependencies(bundle, manyModules[id], bundles)
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

function getBundleDependencies (tracedBundle, modules, bundles) {
  const visited = new Set()
  const traced = []
  for (let module of modules) {
    let { id } = module
    if (id === tracedBundle) continue
    let bundle
    const pluginSeparator = id.indexOf('!')
    if (pluginSeparator > 0) {
      const targetModule = id.substr(pluginSeparator + 1)
      try {
        bundle = getParentBundle(targetModule, bundles)
      } catch {
        if (!visited.has(id)) {
          traced.push(module)
          visited.add(id)
        }
        continue
      }
    } else {
      bundle = getParentBundle(id, bundles)
    }
    if (bundle !== tracedBundle) {
      id = bundle
      module = { id }
    }
    if (!visited.has(id)) {
      const { deps, dependents } = module
      if (deps) module.deps = getDependentBundles(id, deps, bundles)
      if (dependents) module.dependents = getDependentBundles(id, dependents, bundles)
      traced.push(module)
      visited.add(id)
    }
  }
  return traced
}

function getDependentBundles (module, dependencies, bundles) {
  const visited = new Set()
  const shrunk = []
  for (const dependency of dependencies) {
    const bundle = getParentBundle(dependency, bundles)
    if (!visited.has(bundle)) {
      shrunk.push(dependency)
      visited.add(bundle)
    }
  }
  return shrunk
}

module.exports = shrinkBundleDependencies
