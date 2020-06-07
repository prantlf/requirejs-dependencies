window.process = { env: {} }

window.require = module => {
  switch (module) {
    case 'fs': return {
      realpathSync () {}
    }
  }
  return {}
}
