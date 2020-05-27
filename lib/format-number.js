function formatNumber (number) {
  let output = number.toString()
  const decimalPoint = output.indexOf('.')
  if (decimalPoint >= 0) {
    const integer = output.substr(0, decimalPoint)
    const fraction = output.substr(decimalPoint + 1)
    return formatNumber(integer) + '.' + formatNumber(fraction)
  }
  for (let outputIndex = output.length; outputIndex > 3;) {
    outputIndex -= 3
    output = output.substr(0, outputIndex) + ',' + output.substr(outputIndex)
  }
  return output
}

module.exports = formatNumber
