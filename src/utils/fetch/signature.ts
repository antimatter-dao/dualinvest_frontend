export interface Signature {
  signatory: string
  currency: string
  amount: number
  nonce: number
  signV: string
  signR: string
  signS: string
}
