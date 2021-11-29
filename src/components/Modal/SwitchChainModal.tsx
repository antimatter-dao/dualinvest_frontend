import { Typography, Box, useTheme } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Button from 'components/Button/Button'
import { OutlinedCard } from 'components/Card/Card'
import Image from 'components/Image'
import { Chain } from 'models/chain'
import Modal from '.'

export default function SwitchChainModal({
  fromChain,
  toChain,
  onConfirm
}: {
  fromChain: Chain | null
  toChain: Chain | null
  onConfirm: () => void
}) {
  const theme = useTheme()
  return (
    <Modal>
      <Box padding="40px" display="grid" gap="32px" justifyItems="center" width="100%">
        <Typography variant="h6">Switch Chain</Typography>
        {fromChain && toChain && (
          <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
            <OutlinedCard width="100%" color={theme.textColor.text4}>
              <Box
                display="grid"
                justifyItems="center"
                gap="20px"
                margin="0 auto"
                padding="30px 20px 40px"
                height="168px"
                maxHeight="168px"
                maxWidth="168px"
              >
                <Image src={fromChain.logo} style={{ height: 44, width: 44, objectFit: 'contain' }} />
                <Typography variant="inherit" align="center">
                  {fromChain.name}
                </Typography>
              </Box>
            </OutlinedCard>
            <ArrowForwardIcon style={{ margin: '0 20px', flexGrow: 0 }} />
            <OutlinedCard width="100%" color={theme.textColor.text4}>
              <Box
                display="grid"
                justifyItems="center"
                gap="20px"
                margin="0 auto"
                padding="30px 20px 40px"
                maxHeight="168px"
                height="168px"
                maxWidth="168px"
              >
                <Image src={toChain.logo} style={{ height: 44, width: 44, objectFit: 'contain' }} />
                <Typography variant="inherit" align="center">
                  {toChain.name}
                </Typography>
              </Box>
            </OutlinedCard>
          </Box>
        )}
        <Button onClick={onConfirm}>Confirm</Button>
      </Box>
    </Modal>
  )
}
