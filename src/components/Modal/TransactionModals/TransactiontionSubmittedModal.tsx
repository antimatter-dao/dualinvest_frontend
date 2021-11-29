import { Box } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils'
import MessageBox from './MessageBox'

export default function TransactionSubmittedModal({
  children,
  hash,
  header
}: {
  hash?: string
  children?: React.ReactNode
  header?: string
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <MessageBox type={'success'} header={header ?? 'Transaction Submitted'}>
      <Box display="grid" gap="20px" justifyContent="center">
        {children}
        {chainId && hash && (
          <ExternalLink
            href={getEtherscanLink(chainId, hash, 'transaction')}
            style={{ fontSize: 12 }}
            underline="hover"
          >
            View on Etherscan
          </ExternalLink>
        )}
      </Box>
    </MessageBox>
  )
}
