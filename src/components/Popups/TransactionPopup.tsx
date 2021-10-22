import { AlertCircle } from 'react-feather'
import { Typography, useTheme } from '@material-ui/core'
import styled from 'styled-components'
import { ReactComponent as CheckCircle } from '../../assets/componentsIcon/check_circle.svg'
import { useActiveWeb3React } from '../../hooks'
import { ExternalLink } from '../../theme/components'
import { getEtherscanLink } from '../../utils'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  const theme = useTheme()

  return (
    <AutoColumn gap="8px">
      <RowNoFlex>
        <div style={{ paddingRight: 16 }}>
          {success ? <CheckCircle /> : <AlertCircle color={theme.palette.error.main} size={24} />}
        </div>
        <Typography>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</Typography>{' '}
      </RowNoFlex>
      {chainId && (
        <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ margin: '9px 32px' }}>
          View on Etherscan
        </ExternalLink>
      )}
    </AutoColumn>
  )
}
