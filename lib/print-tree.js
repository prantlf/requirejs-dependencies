function printTree (modules) {
  for (const module in modules) {
    process.stdout.write(`${module}
`)
    const dependencies = modules[module]
    for (let i = 0, l = dependencies.length; i < l; ++i) {
      const dependency = dependencies[i]
      const pointer = i < l - 1 ? '├──' : '└──'
      process.stdout.write(`${pointer} ${dependency}
`)
    }
  }
}

module.exports = printTree
