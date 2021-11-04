import { AlertCircle, CheckCircle } from 'react-feather'
import { Typography, useTheme, Box } from '@material-ui/core'
import { useActiveWeb3React } from 'hooks/'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils'

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
    <Box display="grid" gridGap="8px">
      <Box display="flex" alignItems="flex-start" flexWrap="nowrap">
        <div style={{ paddingRight: 16 }}>
          {success ? (
            <CheckCircle color={theme.palette.success.main} size={20} />
          ) : (
            <AlertCircle color={theme.palette.error.main} size={20} />
          )}
        </div>
        <Typography variant="inherit">{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</Typography>{' '}
      </Box>
      {chainId && (
        <ExternalLink
          underline="always"
          href={getEtherscanLink(chainId, hash, 'transaction')}
          style={{ margin: '9px 32px', color: '#ffffff' }}
        >
          View on Etherscan
        </ExternalLink>
      )}
    </Box>
  )
}
