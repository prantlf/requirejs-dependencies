/* global fetch, performance */

import $ from './jquery'
import 'popper.js'
import 'bootstrap'
import { startProgress, stopProgress } from './progress'
import excludePluginDependencies from '../../lib/exclude-plugins'
import implodeBundleDependencies from '../../lib/implode-bundles'
import generateGraph from '../../lib/generate-graph'
import createTree from '../../lib/create-tree'
import formatMilliseconds from '../../lib/format-milliseconds'
import splitList from '../../lib/split-list'
import Viz from '@aduh95/viz.js'

let viz, bundleConfig, tracedModule, tracedDependencues, graphContainer,
  errorContainer, implodeOtherBundles, implodeCurrentBundle, explodeBundles,
  excludePlugins, layout, emphasizeDirects, clusterDirects

async function initializeModuleSelector () {
  graphContainer = document.getElementById('graph')
  errorContainer = document.getElementById('alert')
  try {
    bundleConfig = await fetchData('/bundles')
    const [bundles, modules, plugins] = divideBundleConfig(bundleConfig)
    initializeModules(modules)
    initializeExplodeBundles(bundles)
    initializeExcludePlugins(plugins)
    initializeImplodeBundles()
    initializeGraphOptions()
    document
      .getElementsByTagName('main')[0]
      .style.display = 'block'
  } catch {
    // error handled by fetchData
  }
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
  const start = performance.now()
  const exclude = excludePlugins.value
  let traced = exclude ? excludePluginDependencies(
    tracedDependencues, splitList(exclude)) : tracedDependencues
  if (implodeOtherBundles.checked) {
    traced = implodeBundleDependencies({
      traced,
      bundles: bundleConfig,
      explodeBundles: splitList(explodeBundles.value),
      implodeCurrentBundle: implodeCurrentBundle.checked,
      tracedBundle: tracedModule
    })
  }
  const graph = generateGraph(createTree(tracedModule, traced), {
    G: { layout: layout.value },
    emphasizeDirects: emphasizeDirects.checked,
    clusterDirects: clusterDirects.checked
  })
  if (!viz) viz = new Viz(window.vizOptions)
  const svg = await viz.renderString(graph.to_dot())
  const duration = performance.now() - start
  console.log(`${tracedModule} rendered in ${formatMilliseconds(duration)}`)
  setGraph(svg)
  stopProgress()
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
  setGraph('')
}

function setGraph (svg) {
  hideError()
  graphContainer.innerHTML = svg
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
  graphContainer.style.transform = `scale(.${target.value})`
}

export { initializeModuleSelector }
