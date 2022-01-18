import { Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import ProductCardHeader from 'components/ProductCardHeader'
import VaultForm from './VaultForm'
import { OutlinedCard } from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import Button from 'components/Button/Button'
import useBreakpoint from 'hooks/useBreakpoint'
import { ExternalLink } from 'theme/components'

interface Props {
  logoCurSymbol: string
  curPrice?: string
  title: string
  priceCurSymbol: string
  description: string
  account?: string | null
}

export default function VaultCard(props: Props) {
  const { logoCurSymbol, curPrice, title, priceCurSymbol, description, account } = props
  const isDownMd = useBreakpoint('md')

  return (
    <Card>
      <Box padding="34px 29px 39px">
        <ProductCardHeader
          logoCurSymbol={logoCurSymbol}
          curPrice={curPrice}
          title={title}
          description={description}
          priceCurSymbol={priceCurSymbol}
        />
        <Box display={isDownMd ? 'grid' : 'flex'} width="100%" gap={isDownMd ? '40px' : '80px'} mt={10}>
          <Box width={'100%'}>
            <VaultForm />
          </Box>
          <OutlinedCard width={'100%'} style={{ margin: '12px 0' }}>
            <Box width={'100%'} padding="34px 22px 27px">
              <NumericalCard gray title="Subscribe BTC APY" value="100%" />
              <Box display="flex" flexDirection="column" gap={16} pt={35} pb={42}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16}>Order in progress</Typography>
                  <ExternalLink href="" underline="always">
                    Details
                  </ExternalLink>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16}>Next Order Due Time</Typography>
                  <Typography fontSize={16} fontWeight={700} sx={{ color: theme => theme.palette.text.secondary }}>
                    67:34:23
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16}>
                    Redeemable amount
                    <Typography fontSize={12}>(Revenue not included)</Typography>
                  </Typography>
                  <Typography fontWeight={700} fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
                    3BTC
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={() => {}}
                width="178px"
                height="40px"
                style={{ borderRadius: '16px', float: 'right' }}
                disabled={!account}
              >
                Stop Compounding
              </Button>
            </Box>
          </OutlinedCard>
        </Box>
      </Box>
    </Card>
  )
}
