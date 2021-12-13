export const trimNumberString = (string: string, toDecimal?: number) => {
  const digitIndex = string.indexOf('.')
  if (digitIndex === -1) return string

  if ((toDecimal || toDecimal === 0) && toDecimal >= 0)
    return toDecimal === 0 ? string.slice(0, digitIndex) : string.slice(0, digitIndex + toDecimal + 1)

  const zeroIndex = string.indexOf('0', digitIndex)
  if (zeroIndex === -1) return string
  if (zeroIndex - 1 === digitIndex) return string.slice(0, digitIndex)

  return string.slice(0, zeroIndex)
}
