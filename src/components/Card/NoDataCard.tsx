import { Box, Typography, useTheme } from '@mui/material'
import Card from './Card'
import Image from 'components/Image'
import noServiceUrl from 'assets/images/no_service.png'
import Button from 'components/Button/Button'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

export default function NoDataCard({ height = '40vh' }: { height?: string }) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  return (
    <Card style={{ maxHeight: 350, height: height, width: '100%', maxWidth: theme.width.maxContent, margin: '0 auto' }}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Box display="grid" sx={{ color: theme => theme.palette.text.secondary, fontSize: 20 }} gap={4}>
          <Typography
            variant="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}
          >
            <Image src={noServiceUrl} style={{ width: 24 }} />
            No Data
          </Typography>

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
