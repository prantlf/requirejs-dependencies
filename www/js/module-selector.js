/* global fetch, performance */

import $ from './jquery'
import 'popper.js'
import 'bootstrap'
import 'graphviz-webcomponent/dist/graph.min.js'
import { startProgress, stopProgress } from './progress'
import excludeModuleDependencies from '../../lib/exclude-modules'
import excludePluginDependencies from '../../lib/exclude-plugins'
import implodeBundleDependencies from '../../lib/implode-bundles'
import generateGraph from '../../lib/generate-graph'
import createTree from '../../lib/create-tree'
import formatMilliseconds from '../../lib/format-milliseconds'
import splitList from '../../lib/split-list'

let excludedModules = []
let bundleConfig, tracedModule, tracedDependencues, graphComponent,
  errorContainer, implodeOtherBundles, implodeCurrentBundle, explodeBundles,
  excludePlugins, unhideModules, layout, emphasizeDirects, clusterDirects, startRender

async function initializeModuleSelector () {
  initializeGraphComponent()
  initializeErrorAlert()
  try {
    bundleConfig = await fetchData('/bundles')
    const [bundles, modules, plugins] = divideBundleConfig(bundleConfig)
    initializeModules(modules)
    initializeExplodeBundles(bundles)
    initializeExcludePlugins(plugins)
    initializeImplodeBundles()
    initializeUnhideModules()
    initializeGraphOptions()
    unblockPage()
  } catch {
    // error handled by fetchData
  }
}

function initializeGraphComponent () {
  graphComponent = document.getElementById('graph')
  graphComponent.addEventListener('render', graphRendered)
  graphComponent.addEventListener('error', graphFailed)
  graphComponent.addEventListener('click', graphClicked)
}

function initializeErrorAlert () {
  errorContainer = document.getElementById('alert')
}

function initializeModules (modules) {
  const moduleList = document.getElementById('modules')
  for (const module of modules) $('<option>').text(module).appendTo(moduleList)
  document
    .getElementById('module')
    .addEventListener('change', inspectModule)
}

function initializeExplodeBundles (bundles) {
  const bundleList = document.getElementById('bundles')
  for (const bundle of bundles) $('<option>').text(bundle).appendTo(bundleList)
  explodeBundles = document.getElementById('explode-bundles')
  explodeBundles.addEventListener('change', updateGraph)
}

function initializeExcludePlugins (plugins) {
  const excludeList = document.getElementById('plugins')
  if (plugins.length) {
    const all = plugins.join(',')
    $('<option>').text(all).appendTo(excludeList)
    for (const plugin of plugins) $('<option>').text(plugin).appendTo(excludeList)
  }
  excludePlugins = document.getElementById('exclude-plugins')
  excludePlugins.addEventListener('change', updateGraph)
}

function initializeImplodeBundles () {
  implodeOtherBundles = document.getElementById('implode-other-bundles')
  implodeCurrentBundle = document.getElementById('implode-current-bundle')
  implodeOtherBundles.addEventListener('change', updateGraph)
  implodeCurrentBundle.addEventListener('change', updateGraph)
}

function initializeUnhideModules () {
  unhideModules = document.getElementById('unhide-modules')
  unhideModules.addEventListener('click', clearExcludedModules)
}

function initializeGraphOptions () {
  layout = document.getElementById('layout')
  emphasizeDirects = document.getElementById('emphasize-directs')
  clusterDirects = document.getElementById('cluster-directs')
  layout.addEventListener('change', updateGraph)
  emphasizeDirects.addEventListener('change', updateGraph)
  clusterDirects.addEventListener('change', updateGraph)
  document
    .getElementById('size')
    .addEventListener('change', resizeGraph)
}

function divideBundleConfig (bundleConfig) {
  const bundles = []
  const modules = []
  for (const bundle in bundleConfig) {
    bundles.push(bundle)
    modules.push.apply(modules, bundleConfig[bundle])
  }
  const pluginSet = new Set(['i18n', 'json', 'txt'])
  for (const module of modules) {
    const pluginSeparator = module.indexOf('!')
    if (pluginSeparator > 0) pluginSet.add(module.substr(0, pluginSeparator))
  }
  const plugins = Array.from(pluginSet).sort()
  return [bundles, modules, plugins]
}

function unblockPage () {
  document
    .getElementsByTagName('main')[0]
    .style.display = 'block'
}

async function inspectModule ({ target }) {
  const { value } = target
  if (!value) return clearGraph()
  try {
    let time
    ({ module: tracedModule, traced: tracedDependencues, time } =
      await fetchData(`/modules/${value}`))
    console.log(`${tracedModule} traced in ${formatMilliseconds(time)}`)
    updateGraph()
  } catch {
    // error handled by fetchData
  }
}

async function updateGraph () {
  if (!tracedModule) return
  startProgress()
  startRender = performance.now()
  let traced = tracedDependencues
  if (implodeOtherBundles.checked) {
    traced = implodeBundleDependencies({
      traced,
      bundles: bundleConfig,
      explodeBundles: splitList(explodeBundles.value),
      implodeCurrentBundle: implodeCurrentBundle.checked,
      tracedBundle: tracedModule
    })
  }
  const excludedPlugins = splitList(excludePlugins.value)
  if (excludedPlugins.length) {
    traced = excludePluginDependencies(traced, excludedPlugins)
  }
  if (excludedModules.length) {
    traced = excludeModuleDependencies(traced, excludedModules)
  }
  const graph = generateGraph(createTree(tracedModule, traced), {
    G: { layout: layout.value },
    emphasizeDirects: emphasizeDirects.checked,
    clusterDirects: clusterDirects.checked
  })
  graphComponent.graph = graph.to_dot()
}

function graphRendered () {
  const duration = performance.now() - startRender
  console.log(`${tracedModule} rendered in ${formatMilliseconds(duration)}`)
  hideError()
  stopProgress()
}

function graphFailed () {
  const duration = performance.now() - startRender
  console.log(`${tracedModule} failed in ${formatMilliseconds(duration)}`)
  hideError()
  stopProgress()
}

function graphClicked (event) {
  const path = event.composedPath()
  const node = path[0]
  if (node.tagName !== 'text') return
  excludedModules.push(node.textContent)
  unhideModules.disabled = false
  updateGraph()
}

async function fetchData (url) {
  startProgress()
  try {
    const response = await fetch(url)
    if (response.status !== 200) {
      throw new Error(await response.text() || response.statusText)
    }
    return await response.json()
  } catch (error) {
    reportError(error)
    throw error
  } finally {
    stopProgress()
  }
}

function clearGraph () {
  tracedModule = tracedDependencues = undefined
  graphComponent.graph = ''
  hideError()
}

function reportError ({ message }) {
  clearGraph()
  errorContainer.textContent = message
  errorContainer.style.display = 'block'
}

function hideError () {
  errorContainer.style.display = 'none'
}

function resizeGraph ({ target }) {
  graphComponent.scale = `0.${target.value}`
}

function clearExcludedModules () {
  excludedModules = []
  unhideModules.disabled = true
  updateGraph()
}

export { initializeModuleSelector }
