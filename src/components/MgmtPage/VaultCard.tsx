import { Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import ProductCardHeader from 'components/ProductCardHeader'
import VaultForm from './VaultForm'
import { OutlinedCard } from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import Button from 'components/Button/Button'

interface Props {
  logoCurSymbol: string
  curPrice?: string
  title: string
  priceCurSymbol: string
  description: string
}

export default function VaultCard(props: Props) {
  const { logoCurSymbol, curPrice, title, priceCurSymbol, description } = props

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
        <Box display="flex" justifyContent="space-between">
          <Box width={496}>
            <VaultForm />
          </Box>
          <OutlinedCard>
            <Box width={439} padding="34px 22px 27px">
              <NumericalCard gray title="Subscribe BTC APY" value="100%" />
              <Box display="flex" flexDirection="column" gap={16} pt={35} pb={42}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Order in progress</Typography>
                  <Typography>3 (Details)</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Next Order Due Time</Typography>
                  <Typography>67:34:23</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>
                    Redeemable amount
                    <Typography fontSize={12}>(Revenue not included)</Typography>
                  </Typography>
                  <Typography>3BTC</Typography>
                </Box>
              </Box>
              <Button onClick={() => {}} width="178px" height="40px" style={{ borderRadius: 16, float: 'right' }}>
                Stop Compounding
              </Button>
            </Box>
          </OutlinedCard>
        </Box>
      </Box>
    </Card>
  )
}
