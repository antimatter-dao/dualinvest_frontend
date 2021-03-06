import { Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import Image from 'components/Image'
import noServiceUrl from 'assets/images/no_service.png'
import { ExternalLink } from 'theme/components'

export default function NoService() {
  return (
    <Card width="100%" style={{ maxWidth: 920, margin: '0 auto auto', marginTop: 80 }}>
      <Box display="grid" gap="40px" padding="48px 64px">
        <Typography fontSize={28} fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Image src={noServiceUrl} /> Service Not Available in Your Region
        </Typography>
        <Box maxWidth={760} width="100%" sx={{ fontSize: 20, color: theme => theme.palette.text.secondary }}>
          <p> Sorry! For compliance reasons, this service is not accessible in your area.</p>
          <p>
            The dapp is only open to non-U.S. and non-China persons and entities. Use of VPN, Tor, proxies or other
            means to circumvent this restriction is a violation of our&nbsp;
            <ExternalLink sx={{ fontSize: 20 }} href="https://docs.antimatter.finance/disclaimer/notice-and-disclaimer">
              Terms of Service.
            </ExternalLink>
          </p>
          <p>
            For details, please see our&nbsp;
            <ExternalLink sx={{ fontSize: 20 }} href="https://docs.antimatter.finance/disclaimer/notice-and-disclaimer">
              Terms of Service
            </ExternalLink>
            .
          </p>
        </Box>
      </Box>
    </Card>
  )
}
