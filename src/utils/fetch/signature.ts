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

export interface SignatureRequestClaim {
  account: string
  chainId: number
  orderId: string
}

export interface SignatureResponseClaim {
  earned: string
  fee: number
  orderId: number
  productId: number
  returnedAmount: string
  returnedCurrency: string
  signR: string
  signS: string
  signV: string
  signatory: string
}
