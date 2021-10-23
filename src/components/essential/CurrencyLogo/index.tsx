import React, { useMemo } from 'react'
import styled from 'styled-components'

import useHttpLocations from '../../../hooks/useHttpLocations'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { Token } from '../../../constants/token/token'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(undefined)

  const srcs: string[] = useMemo(() => {
    if (currency instanceof Token) {
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
