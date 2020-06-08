/* global location, removeEventListener, Module, Blob */

const locateFile = fileName => `${location.origin}/@aduh95/viz.js/dist/${fileName}`

const onmessage = async function (event) {
  if (this.messageHandler === undefined) {
    // Lazy loading actual handler
    const { default: init, onmessage } = await import(
      Module.locateFile('render.browser.js')
    )
    // Removing default MessageEvent handler
    removeEventListener('message', onmessage)
    await init(Module)
    this.messageHandler = onmessage
  }
  return this.messageHandler(event)
}

window.vizOptions = {
  workerURL: URL.createObjectURL(new Blob(
    [`const Module = { locateFile: ${locateFile.toString()} }
      onmessage = ${onmessage.toString()}`],
    { type: 'application/javascript' }
  ))
}
