function createModuleMap (traced) {
  const map = new Map()
  for (const module of traced) {
    map.set(module.id, module)
  }
  return map
}

function collectTracedModules (tracedModules, moduleMap) {
  const modules = []
  for (let module of tracedModules) {
    module = moduleMap.get(module)
    if (module.deps) modules.push.apply(modules, module.deps)
  }
  return modules
}

function createMultiTree (tracedModules, traced) {
  if (!Array.isArray(tracedModules)) tracedModules = [tracedModules]
  const moduleMap = createModuleMap(traced)
  const modules = collectTracedModules(tracedModules, moduleMap)
  const root = {}
  for (let module of modules) {
    module = moduleMap.get(module)
    root[module.id] = module.deps || []
  }
  return root
}

function createSingleTree (traced) {
  const root = {}
  for (const module of traced) {
    root[module.id] = module.deps || []
  }
  return root
}

function createTree (tracedModules, traced) {
  if (Array.isArray(tracedModules)) return createMultiTree(tracedModules, traced)
  return createSingleTree(traced)
}

module.exports = createTree
