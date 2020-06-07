function fail (message) {
  if (message instanceof Error) message = message.message
  process.stderr.write(`${message}
`)
  process.exit(1)
}

module.exports = fail
