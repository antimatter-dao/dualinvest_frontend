import React, { useMemo } from 'react'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { Token } from '../../../constants/token/token'
import { BTC, USDT } from 'constants/index'
import BtcLogo from 'assets/svg/btc_logo.svg'
import UsdtLogo from 'assets/svg/usdt_logo.svg'

export const getTokenLogoURL = (address: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const srcs: string[] = useMemo(() => {
    if (currency?.symbol === BTC.symbol) {
      return [BtcLogo]
    }
    if (currency?.symbol === 'BTCB') {
      return [BtcLogo]
    }
    if (currency?.symbol === USDT.symbol) {
      return [UsdtLogo]
    }
    if (currency instanceof Token) {
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency])
  return (
    <Logo
      style={{
        ...style,
        width: size,
        height: size,
        borderRadius: size
        // boxShadow: ' 0px 6px 10px rgba(0, 0, 0, 0.075)'
      }}
      srcs={srcs}
      alt={`${currency?.symbol ?? 'token'} logo`}
    />
  )
}
