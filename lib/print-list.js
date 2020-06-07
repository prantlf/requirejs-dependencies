function printList (traced) {
  for (const { id } of traced) {
    process.stdout.write(`${id}
`)
  }
}

module.exports = printList
