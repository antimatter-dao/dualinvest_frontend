import { Box, Tab, TabProps } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { SUPPORTED_CURRENCIES, SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { useActiveWeb3React } from 'hooks'
import Tabs from './Tabs'

export default function CurrencyTabs({ contents }: { contents: JSX.Element[] }) {
  const { chainId } = useActiveWeb3React()
  return (
    <Tabs
      titles={SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID].map(symbol => {
        const cur = SUPPORTED_CURRENCIES[symbol]
        return (
          <Box
            key={symbol}
            sx={{ color: cur.color, fontWeight: 500, fontSize: 16 }}
            display="flex"
            alignItems={'center'}
            gap={8}
            justifyContent={'center'}
          >
            <CurrencyLogo currency={SUPPORTED_CURRENCIES[symbol]} size="22px" /> {cur.symbol}
          </Box>
        )
      })}
      contents={contents}
      CustomTab={CustomTab}
    />
  )
}

function CustomTab(props: TabProps) {
  return (
    <Tab
      {...props}
      sx={{
        width: 116,
        height: 44,
        mr: { xs: 23, md: 25 },
        mb: 47,
        textTransform: 'none',
        borderRadius: 1,
        background: theme => theme.palette.background.paper,
        color: theme => theme.palette.primary.main,
        border: '1px solid transparent',
        opacity: 1,
        '&.Mui-selected': {
          color: theme => theme.palette.text.primary,
          borderColor: theme => theme.palette.primary.main
        }
      }}
    />
  )
}
