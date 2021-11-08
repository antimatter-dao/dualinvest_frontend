import { styled } from '@mui/material'
import CurrencyLogo from '.'
import { Currency } from '../../../constants/token/currency'

const Wrapper = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row'
})

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sx={{ marginRight: margin ? (size / 3 + 8).toString() + 'px' : undefined }}>
      {currency0 && (
        <CurrencyLogo currency={currency0} size={size.toString() + 'px'} style={{ zIndex: 2, background: '#ffffff' }} />
      )}
      {currency1 && (
        <CurrencyLogo
          currency={currency1}
          size={size.toString() + 'px'}
          style={{
            background: '#ffffff',
            position: 'absolute',
            left: `${(size / 2).toString() + 'px'} !important`
          }}
        />
      )}
    </Wrapper>
  )
}
