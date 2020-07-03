function excludeModuleDependencies (traced, excluded) {
  if (!excluded.length) return traced
  let singleBundle
  // support both dependency array (from traceSingle) and object
  // with keys ponting to dependency arrays (from traceMany)
  if (Array.isArray(traced)) {
    singleBundle = true
    traced = { singleModule: traced }
  }
  // convert array with plugin names to exclude to set for better perfornace
  excluded = new Set(excluded)
  // rebuild dependency arrays without expluded plugins
  const pruned = {}
  for (const id in traced) {
    pruned[id] = pruneModules(traced[id], excluded)
  }
  return singleBundle ? pruned.singleModule : pruned
}

function pruneModules (modules, excluded) {
  const pruned = []
  for (let module of modules) {
    if (!excluded.has(module.id)) {
      const { id, path, deps, dependents } = module
      module = { id, path }
      if (deps) module.deps = pruneDependecies(deps, excluded)
      if (dependents) module.dependents = pruneDependecies(dependents, excluded)
      pruned.push(module)
    }
  }
  return pruned
}

function pruneDependecies (modules, excluded) {
  return modules.filter(module => !excluded.has(module))
}

module.exports = excludeModuleDependencies
