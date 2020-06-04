function implodeBundleDependencies ({
  traced, bundles, explodeBundles, implodeCurrentBundle, tracedBundle
}) {
  let singleBundle
  // support both dependency array (from traceSingle) and object
  // with keys ponting to dependency arrays (from traceMany)
  if (Array.isArray(traced)) {
    singleBundle = true
    traced = { [tracedBundle]: traced }
  }
  // convert arrays with bundle content to sets for better perfornace
  bundles = createBundleSets(bundles)
  // convert array with bundle names to explode to set for better perfornace
  explodeBundles = new Set(explodeBundles || [])
  // rebuild dependency arrays to contain bundles instead of single modules
  const imploded = {}
  for (const module in traced) {
    // module to track can be bundle itself
    const bundle = module in bundles ? module : getParentBundle(module, bundles)
    // do not modify dependencies of modules that are not bundled
    if (bundle) {
      imploded[module] = getBundleDependencies(
        bundle, traced[module], bundles, explodeBundles, implodeCurrentBundle)
    } else {
      imploded[module] = traced[module]
    }
  }
  return singleBundle ? imploded[tracedBundle] : imploded
}

function createBundleSets (bundles) {
  const sets = {}
  for (const bundle in bundles) {
    // convert array of module dependencies to a set with a fast lookup
    sets[bundle] = new Set(bundles[bundle])
  }
  return sets
}

function getParentBundle (module, bundles) {
  for (const bundle in bundles) {
    // the module can be a bundle itself
    if (bundle === module) return bundle
    // check if the module is included in the current bundle content
    const set = bundles[bundle]
    if (set.has(module)) return bundle
  }
}

function getBundleDependencies (
  tracedBundle, modules, bundles, explodeBundles, implodeCurrentBundle
) {
  const visited = new Set()
  const traced = []
  for (let module of modules) {
    let { id } = module
    // do not add parent bundle of the traced module to its dependencies
    if (id === tracedBundle) continue
    let bundle
    const pluginSeparator = id.indexOf('!')
    // process the module that the plugin points to
    if (pluginSeparator > 0) {
      const targetModule = id.substr(pluginSeparator + 1)
      bundle = getParentBundle(targetModule, bundles)
      // do not modify dependencies of modules that are not bundled
      if (!bundle) {
        tryPushModule(id, module)
        continue
      }
      id = targetModule
    } else {
      bundle = getParentBundle(id, bundles)
      // do not modify dependencies of modules that are not bundled
      if (!bundle) {
        tryPushModule(id, module)
        continue
      }
    }
    // replace the dependency module with its parent bundle if imploding
    if ((bundle !== tracedBundle && !explodeBundles.has(bundle)) ||
        (bundle === tracedBundle && implodeCurrentBundle)) {
      id = bundle
      module = { id }
    }
    if (!visited.has(id)) {
      // modify dependencies and dependents of the current module
      const { deps, dependents } = module
      if (deps) {
        module.deps = getDependentBundles(
          deps, bundle, bundles, explodeBundles, implodeCurrentBundle)
      }
      if (dependents) {
        module.dependents = getDependentBundles(
          dependents, bundle, bundles, explodeBundles, implodeCurrentBundle)
      }
      traced.push(module)
      visited.add(id)
    }
  }
  return traced

  function tryPushModule (id, module) {
    if (!visited.has(id)) {
      traced.push(module)
      visited.add(id)
    }
  }
}

function getDependentBundles (dependencies, tracedBundle, bundles, explodeBundles, implodeCurrentBundle) {
  const visited = new Set()
  const traced = []
  for (let dependency of dependencies) {
    let bundle
    const pluginSeparator = dependency.indexOf('!')
    // process the module that the plugin points to
    if (pluginSeparator > 0) {
      const targetModule = dependency.substr(pluginSeparator + 1)
      bundle = getParentBundle(targetModule, bundles)
      // do not modify dependencies of modules that are not bundled
      if (!bundle) {
        tryPushDependency(dependency)
        continue
      }
      dependency = targetModule
    } else {
      bundle = getParentBundle(dependency, bundles)
      // do not modify dependencies of modules that are not bundled
      if (!bundle) {
        tryPushDependency(dependency)
        continue
      }
    }
    // replace the dependency module with its parent bundle if imploding
    if ((bundle !== tracedBundle && !explodeBundles.has(bundle)) ||
        (bundle === tracedBundle && implodeCurrentBundle)) dependency = bundle
    tryPushDependency(dependency)
  }
  return traced

  function tryPushDependency (dependency) {
    if (!visited.has(dependency)) {
      traced.push(dependency)
      visited.add(dependency)
    }
  }
}

module.exports = implodeBundleDependencies
