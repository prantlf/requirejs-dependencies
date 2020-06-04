const { traceSingle, traceMany } = require('./trace')
const getUnion = require('./get-union')
const getIntersection = require('./get-intersection')
const shrinkBundleDependencies = require('./shrink-bundles')

traceSingle.traceSingle = traceSingle
traceSingle.traceMany = traceMany
traceSingle.getUnion = getUnion
traceSingle.getIntersection = getIntersection
traceSingle.shrinkBundleDependencies = shrinkBundleDependencies

module.exports = traceSingle
