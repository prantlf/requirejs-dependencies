function excludePluginDependencies (traced, plugins) {
  if (!plugins.length) return traced
  let singleBundle
  // support both dependency array (from traceSingle) and object
  // with keys ponting to dependency arrays (from traceMany)
  if (Array.isArray(traced)) {
    singleBundle = true
    traced = { singleModule: traced }
  }
  // convert array with plugin names to exclude to set for better perfornace
  plugins = new Set(plugins)
  // rebuild dependency arrays without expluded plugins
  const pruned = {}
  for (const id in traced) {
    pruned[id] = pruneModules(traced[id], plugins)
  }
  return singleBundle ? pruned.singleModule : pruned
}

function pruneModules (modules, plugins) {
  const excluded = new Set()
  for (const { id } of modules) checkExclusion(id, excluded, plugins)
  if (!excluded.size) return modules
  const pruned = []
  for (let module of modules) {
    if (!excluded.has(module.id)) {
      const { id, path, deps, dependents } = module
      module = { id, path }
      if (deps) module.deps = pruneDependecies(deps, plugins, excluded)
      if (dependents) module.dependents = pruneDependecies(dependents, plugins, excluded)
      pruned.push(module)
    }
  }
  return pruned
}

function pruneDependecies (modules, plugins, excluded) {
  for (const module of modules) checkExclusion(module, excluded, plugins)
  if (!excluded.size) return modules
  return modules.filter(module => !excluded.has(module))
}

function checkExclusion (module, excluded, plugins) {
  const [plugin, target] = toExclude(module, plugins)
  if (plugin) {
    excluded.add(module)
    if (target) {
      excluded.add(target)
      if (plugin === 'i18n') excluded.add(getRootLocalization(target))
    }
  }
}

function toExclude (module, plugins) {
  if (plugins.has(module)) return [module]
  const pluginSeparator = module.indexOf('!')
  if (pluginSeparator < 0) return []
  const plugin = module.substr(0, pluginSeparator)
  if (!plugins.has(plugin)) return []
  return [plugin, module.substr(pluginSeparator + 1)]
}

function getRootLocalization (module) {
  let rootSeperator = module.lastIndexOf('/nls/')
  if (rootSeperator < 0) return module
  rootSeperator += 5
  return `${module.substr(0, rootSeperator)}root/${module.substr(rootSeperator)}`
}

module.exports = excludePluginDependencies
