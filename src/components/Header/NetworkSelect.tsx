import { MenuItem } from '@mui/material'
import LogoText from 'components/LogoText'
import Select from 'components/Select/Select'
import { useActiveWeb3React } from 'hooks'
import { ChainId, ChainList, SUPPORTED_NETWORKS } from 'constants/chain'

export default function NetworkSelect() {
  const { chainId, account, library } = useActiveWeb3React()

  return (
    <div style={{ width: '130', margin: '8px 0 15px' }}>
      <Select
        defaultValue={chainId ?? 3}
        value={chainId ?? 3}
        width="130px"
        height="36px"
        style={{ background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.1)' }}
      >
        {ChainList.map(option => (
          <MenuItem
            onClick={() => {
              if ([ChainId.MAINNET, ChainId.ROPSTEN, ChainId.RINKEBY, ChainId.KOVAN].includes(option.id)) {
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
