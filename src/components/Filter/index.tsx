import { Box, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { useActiveWeb3React } from 'hooks'

export default function Filter({
  options,
  checkedOption,
  onChange
}: {
  options?: string[]
  checkedOption: string
  onChange: (option: string) => void
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  return (
    <Box display="flex" alignItems="center" gap={23} mb={32}>
      {(options ? options : ['All', ...SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID]]).map(
        (option: string) => (
          <OutlineButton
            key={option}
            primary={option === checkedOption}
            onClick={() => onChange(option)}
            width="80px"
            height="40px"
            style={{
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
