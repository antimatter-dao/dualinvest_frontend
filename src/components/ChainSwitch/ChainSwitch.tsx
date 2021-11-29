import { Box, Typography, styled, useTheme } from '@mui/material'
import { OutlinedCard } from 'components/Card/Card'
import Image from 'components/Image'
import SwitchButton from 'components/Select/ChainSwap/SwitcherButton'
import { Chain } from 'models/chain'

interface Props {
  fromChain: Chain | null
  toChain: Chain | null
  height?: string | number
}

const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: 500
}))

export default function ChainSwitch(props: Props) {
  const { fromChain, toChain, height } = props
  const theme = useTheme()

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          position: 'relative',
          gap: 8,
          mt: 14
        }}
      >
        <Box width="100%">
          <Label sx={{ mb: 8 }}>Send</Label>
        </Box>
        <Box width="100%">
          <Label sx={{ mb: 8 }}>To</Label>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'stretch',
          position: 'relative',
          gap: 8
        }}
      >
        <Box width="100%">
          <OutlinedCard width="100%" color={theme.textColor.text4} style={{ height: '100%' }}>
            <Box
              display="grid"
              gap="8px"
              padding="12px 16px"
              width="100%"
              height={height || '100%'}
              gridTemplateRows="auto 1fr"
            >
              <Image src={fromChain?.logo || ''} style={{ height: 28, width: 28, objectFit: 'contain' }} />
              <Typography variant="inherit" sx={{ fontSize: 12 }}>
                {fromChain?.name || ''}
              </Typography>
            </Box>
          </OutlinedCard>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)'
          }}
        >
          <SwitchButton />
        </Box>
        <Box width="100%">
          <OutlinedCard width="100%" color={theme.textColor.text4} style={{ height: '100%' }}>
            <Box
              display="grid"
              gap="8px"
              padding="12px 16px"
              width="100%"
              height={height || '100%'}
              gridTemplateRows="auto 1fr"
            >
              <Image src={toChain?.logo || ''} style={{ height: 28, width: 28, objectFit: 'contain' }} />
              <Typography variant="inherit" sx={{ fontSize: 12 }}>
                {toChain?.name || ''}
              </Typography>
            </Box>
          </OutlinedCard>
        </Box>
      </Box>
    </>
  )
}
