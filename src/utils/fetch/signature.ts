export interface Signature {
  signatory: string
  currency: string
  amount: number
  nonce: number
  signV: string
  signR: string
  signS: string
}

export interface SignatureRequest {
  account: string
  amount: number
  chainId: number
  currency: string
  nonce: number
}

export interface SignatureRequest2 {
  account: string
  chainId: number
  orderId: string
}
