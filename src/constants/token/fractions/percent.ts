import { Fraction } from './fraction'
import { _100, Rounding } from '../constants'

const _100_PERCENT = new Fraction(_100)

export class Percent extends Fraction {
  public toSignificant(significantDigits = 5, format?: Record<string, unknown>, rounding?: Rounding): string {
    return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces = 2, format?: Record<string, unknown>, rounding?: Rounding): string {
    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding)
  }
}
