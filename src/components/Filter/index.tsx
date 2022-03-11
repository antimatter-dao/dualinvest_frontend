import { Box, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'

export default function Filter({
  options = ['All', ...SUPPORTED_CURRENCY_SYMBOL[NETWORK_CHAIN_ID]],
  checkedOption,
  onChange
}: {
  options?: string[]
  checkedOption: string
  onChange: (option: string) => void
}) {
  const theme = useTheme()
  return (
    <Box display="flex" alignItems="center" gap={23} mb={32}>
      {options.map(option => (
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
      ))}
    </Box>
  )
}
