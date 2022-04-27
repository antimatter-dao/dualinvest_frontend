import { Box, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { useActiveWeb3React } from 'hooks'
import useBreakpoint from 'hooks/useBreakpoint'

export default function Filter({
  options,
  checkedOption,
  onChange
}: {
  options?: string[]
  checkedOption: string
  onChange: (option: string) => void
}) {
  const isDownMd = useBreakpoint('md')
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  return (
    <Box display="flex" alignItems="center" gap={{ xs: 10, ms: 23 }} mb={{ xs: 10, md: 32 }} flexWrap={'wrap'}>
      {(options ? options : ['All', ...SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID]]).map(
        (option: string) => (
          <OutlineButton
            key={option}
            primary={option === checkedOption}
            onClick={() => onChange(option)}
            width={isDownMd ? '60px' : '80px'}
            height="40px"
            style={{
              minWidth: 30,
              color: option === checkedOption ? theme.palette.primary.main : theme.palette.text.primary
            }}
          >
            {option}
          </OutlineButton>
        )
      )}
    </Box>
  )
}
