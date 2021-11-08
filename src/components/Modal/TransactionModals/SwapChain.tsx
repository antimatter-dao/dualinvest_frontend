import { Box, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Chain } from 'models/chain'
import LogoText from 'components/LogoText'

interface Props {
  from: Chain
  to: Chain
}

export default function SwapChain(props: Props) {
  const { from, to } = props

  return (
    <Box
      bgcolor="rgba(255, 255, 255, 0.08)"
      borderRadius="10px"
      height="48px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="0 40px"
      width="100%"
    >
      <Box display="flex">
        <Box marginRight={'12px'}>
          <Typography sx={{ opacity: 0.6 }}>From: </Typography>
        </Box>
        <LogoText logo={from.logo} text={from.symbol} />
      </Box>
      <Box color={'#FFFFFF'} style={{ marginBottom: -5 }}>
        <ArrowForwardIcon />
      </Box>
      <Box display="flex">
        <Box marginRight={'12px'}>
          <Typography sx={{ opacity: 0.6 }}>To: </Typography>
        </Box>
        <LogoText logo={to.logo} text={to.symbol} />
      </Box>
    </Box>
  )
}
