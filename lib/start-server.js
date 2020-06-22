#!/usr/bin/env node

const http = require('http')
const connect = require('connect')
const morgan = require('morgan')
const compression = require('compression')
const serveStatic = require('serve-static')
const { traceSingle } = require('./trace')
const loadConfig = require('./load-config')

// send JSON response
function sendJSON (response, data) {
  const content = JSON.stringify(data)
  response.writeHead(200, {
    'content-type': 'application/json',
    'content-length': content.length
  })
  response.end(content)
}

// send error response
function sendError (response, { message }) {
  response.writeHead(400, { 'content-type': 'text/plain' })
  response.end(message)
}

function printEndpoint ({ host, port }) {
  process.stderr.write(`Listening on http://${host}:${port}.
`)
}

function startServer ({ host, port, rootDir, config }) {
  if (!host) host = '0.0.0.0'
  if (!port) port = 8008
  if (typeof config === 'string') config = loadConfig(config)

  const bundles = config.bundles || {}
  delete config.bundles

  // send bundles to client by /bundles
  function serveBundles (request, response, next) {
    if (request.url !== '/bundles') return next()
    sendJSON(response, bundles)
  }

  // send module dependencies to client by /modules/:id
  function serveModules (request, response, next) {
    const path = request.url
    if (!path.startsWith('/modules/')) return next()
    const module = path.substr(9)
    traceSingle({ module, rootDir, config })
      .then(({ traced, time }) => sendJSON(response, { module, traced, time }))
      .catch(error => sendError(response, error))
  }

  // serve /www as static assets and /modules with data
  const handler = connect()
    .use(morgan('short'))
    .use(compression())
    .use(serveBundles)
    .use(serveModules)
    .use(serveStatic(`${__dirname}/..`, { etag: false, index: ['www/index.min.html'] }))

  // start http server
  return new Promise((resolve, reject) => {
    http
      .createServer(handler)
      .listen(port, host, error => {
        if (error) reject(error)
        if (host === '0.0.0.0') host = 'localhost'
        resolve({ host, port })
      })
  })
}

module.exports = { startServer, printEndpoint }
