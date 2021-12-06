import { MenuItem } from '@mui/material'
import LogoText from 'components/LogoText'
import Select from 'components/Select/Select'
import { useActiveWeb3React } from 'hooks'
import { ChainId, ChainList, SUPPORTED_NETWORKS } from 'constants/chain'

export default function NetworkSelect() {
  const { chainId, account, library } = useActiveWeb3React()

  if (!chainId || !account) return null

  return (
    <div style={{ width: '130', margin: '8px 0 15px' }}>
      <Select
        disabled
        defaultValue={chainId ?? 3}
        value={chainId ?? 3}
        width="max-content"
        height="36px"
        style={{
          background: 'transparent',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          '& .Mui-disabled.MuiInputBase-input': {
            paddingRight: 10,
            color: theme => theme.palette.text.primary,
            WebkitTextFillColor: theme => theme.palette.text.primary
          }
        }}
      >
        {ChainList.map(option => (
          <MenuItem
            onClick={() => {
              if (Object.values(ChainId).includes(option.id)) {
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
            <LogoText logo={option.logo} text={option.symbol} gapSize={'small'} fontSize={14} />
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
