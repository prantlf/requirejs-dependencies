function formatNumber (number) {
  let output = number.toString()
  // handle integer and decimal parts separately
  const decimalPoint = output.indexOf('.')
  if (decimalPoint >= 0) {
    const integer = output.substr(0, decimalPoint)
    const fraction = output.substr(decimalPoint + 1)
    return formatNumber(integer) + '.' + formatNumber(fraction)
  }
  // insert comma after each three digits
  for (let outputIndex = output.length; outputIndex > 3;) {
    outputIndex -= 3
    output = output.substr(0, outputIndex) + ',' + output.substr(outputIndex)
  }
  return output
}

module.exports = formatNumber
