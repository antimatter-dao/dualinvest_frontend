import { MenuItem, Box } from '@mui/material'
import LogoText from 'components/LogoText'
import Select from 'components/Select/Select'
import { useActiveWeb3React } from 'hooks'
import { ChainId, ChainListMap, NETWORK_CHAIN_ID, SUPPORTED_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'

export default function NetworkSelect() {
  const { chainId, account, library } = useActiveWeb3React()
  const isDownSm = useBreakpoint('sm')

  if (!account) return null

  return (
    <Box sx={{ width: '130', margin: { xs: '0', sm: '8px 0 15px' } }}>
      <Select
        defaultValue={chainId ?? NETWORK_CHAIN_ID}
        value={chainId ?? NETWORK_CHAIN_ID}
        width="max-content"
        height={isDownSm ? '24px' : '36px'}
        style={{
          background: 'transparent',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          '& .Mui-disabled.MuiSelect-select.MuiInputBase-input': {
            paddingRight: isDownSm ? 0 : 10,
            color: theme => theme.palette.text.primary,
            WebkitTextFillColor: theme => theme.palette.text.primary
          }
        }}
      >
        {SUPPORTED_CHAIN_ID.map((chainId: ChainId) => {
          const option = ChainListMap[chainId]
          return (
            <MenuItem
              onClick={() => {
                if ([1, 3, 4, 5, 42].includes(option.id)) {
                  library?.send('wallet_switchEthereumChain', [
                    { chainId: SUPPORTED_NETWORKS[option.id as ChainId]?.chainId },
                    account
                  ])
                } else {
                  const params = SUPPORTED_NETWORKS[option.id as ChainId]
                  library?.send('wallet_addEthereumChain', [params, account])
                }
              }}
              value={option.id}
              key={option.id}
              selected={chainId === option.id}
            >
              {isDownSm ? (
                <Image src={option.logo} style={{ height: 14, width: 'auto', margin: '5px 0 0' }} />
              ) : (
                <LogoText logo={option.logo} text={option.symbol} gapSize={'small'} fontSize={14} />
              )}
            </MenuItem>
          )
        })}
      </Select>
    </Box>
  )
}
