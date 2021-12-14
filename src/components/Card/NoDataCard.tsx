import { Box, Typography, useTheme } from '@mui/material'
import Card from './Card'
import Image from 'components/Image'
import noServiceUrl from 'assets/images/no_service.png'
import Button from 'components/Button/Button'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import React from 'react'

export default function NoDataCard({
  height = '40vh',
  outlined,
  text,
  children
}: {
  height?: string
  outlined?: boolean
  text?: string
  children?: React.ReactNode
}) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  return (
    <Card
      style={{
        maxHeight: 350,
        height: height,
        width: '100%',
        maxWidth: theme.width.maxContent,
        margin: '0 auto',
        border: outlined ? '1px solid rgba(0, 0, 0, 0.1)' : undefined
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Box display="grid" sx={{ color: theme => theme.palette.text.secondary, fontSize: 20 }} gap={4}>
          <Typography
            variant="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}
          >
            <Image src={noServiceUrl} style={{ width: 24 }} />
            {text ?? 'No Data'}
          </Typography>
          {children}

          {!account && (
            <>
              <Typography align="center" variant="inherit">
                Please connect your wallet
              </Typography>
              <Button onClick={toggleWallet} width="240px" style={{ marginTop: 20, fontSize: 14, height: 40 }}>
                Connect Wallet
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Card>
  )
}
