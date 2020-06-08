import {
  startServer,
  traceSingle,
  traceMany,
  getUnion,
  getIntersection,
  excludePluginDependencies,
  implodeBundleDependencies,
  createTree,
  generateGraph,
  renderGraph,
  loadConfig,
  printList,
  printTree,
  printTiming,
  printEndpoint,
  formatMilliseconds,
  splitList
} from '../lib/index'
import { startServer as startServer2, printEndpoint as printEndpoint2 } from '../lib/start-server'
import { traceSingle as traceSingle2, traceMany as traceMany2 } from '../lib/trace'
import * as getUnion2 from '../lib/get-union'
import * as getIntersection2 from '../lib/get-intersection'
import * as excludePluginDependencies2 from '../lib/exclude-plugins'
import * as implodeBundleDependencies2 from '../lib/implode-bundles'
import * as createTree2 from '../lib/create-tree'
import * as generateGraph2 from '../lib/generate-graph'
import * as renderGraph2 from '../lib/render-graph'
import * as loadConfig2 from '../lib/load-config'
import * as printList2 from '../lib/print-list'
import * as printTree2 from '../lib/print-tree'
import * as printTiming2 from '../lib/print-timing'
import * as formatMilliseconds2 from '../lib/format-milliseconds'
import * as splitList2 from '../lib/split-list'

exports['test index exports'] = assert => {
  assert.equal(startServer, startServer2, 'startServer is exported')
  assert.equal(traceSingle, traceSingle2, 'traceSingle is exported')
  assert.equal(traceMany, traceMany2, 'traceMany is exported')
  assert.equal(getUnion, getUnion2, 'getUnion is exported')
  assert.equal(getIntersection, getIntersection2, 'getIntersection is exported')
  assert.equal(excludePluginDependencies, excludePluginDependencies2, 'excludePluginDependencies is exported')
  assert.equal(implodeBundleDependencies, implodeBundleDependencies2, 'implodeBundleDependencies is exported')
  assert.equal(createTree, createTree2, 'createTree is exported')
  assert.equal(generateGraph, generateGraph2, 'generateGraph is exported')
  assert.equal(renderGraph, renderGraph2, 'renderGraph is exported')
  assert.equal(loadConfig, loadConfig2, 'loadConfig is exported')
  assert.equal(printList, printList2, 'printList is exported')
  assert.equal(printTree, printTree2, 'printTree is exported')
  assert.equal(printTiming, printTiming2, 'printTiming is exported')
  assert.equal(printEndpoint, printEndpoint2, 'printEndpoint is exported')
  assert.equal(formatMilliseconds, formatMilliseconds2, 'formatMilliseconds is exported')
  assert.equal(splitList, splitList2, 'splitList is exported')
}

/* eslint-disable @typescript-eslint/no-unused-vars */
exports['lint exports'] = async assert => {
  const { host: string, port: number } = await startServer({ rootDir: '.' })
  const { traced: single } = await traceSingle({ module: 'house', rootDir: '.' })
  const { traced: many } = await traceMany({ modules: [], rootDir: '.' })
  const union = getUnion([])
  const intersection = getIntersection([])
  const excluded = excludePluginDependencies([], [])
  const imploded = implodeBundleDependencies({ traced: [], bundles: {} })
  const tree: object = createTree([])
  const graph: any = generateGraph({})
  const { dot, image } = await renderGraph(graph)
  const config: object = loadConfig('config.js')
  printList([])
  printTree({})
  printTiming(['house'], 1.2)
  printEndpoint({ host: 'localhost', port: 8008 })
  const duration: string = formatMilliseconds(1.2)
  const splitted: string[] = splitList('')
}

if (require.main === module) require('test').run(exports) // eslint-disable-line @typescript-eslint/no-var-requires
