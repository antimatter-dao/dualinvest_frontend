export function toLocaleNumberString(numberStr: string | number, digit = 2) {
  const str: number = typeof numberStr === 'number' ? numberStr : +numberStr

  return str.toLocaleString('en-US', { minimumFractionDigits: digit, maximumFractionDigits: digit })
}
