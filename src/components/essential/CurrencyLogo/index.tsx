import React, { useMemo } from 'react'
import { styled, Theme } from '@material-ui/core'

// import useHttpLocations from '../../../hooks/useHttpLocations'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { Token } from '../../../constants/token/token'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledLogo = styled(Logo)(({ theme, size }: { size?: string; theme: Theme }) => ({
  width: size,
  height: size,
  borderRadius: size,
  boxShadow: ' 0px 6px 10px rgba(0, 0, 0, 0.075)',
  backgroundColor: theme.palette.primary.contrastText
}))

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  // const uriLocations = useHttpLocations(undefined)

  const srcs: string[] = useMemo(() => {
    if (currency instanceof Token) {
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency])
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
