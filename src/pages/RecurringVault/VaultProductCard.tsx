import { Box, Typography } from '@mui/material'
import NumericalCard from 'components/Card/NumericalCard'
import ProductCardHeader from 'components/ProductCardHeader'
import Divider from 'components/Divider'
import { Timer } from 'components/Timer'
import Button from 'components/Button/Button'
import { OutlinedCard } from 'components/Card/Card'

export default function VaultProductCard({
  logoCurSymbol,
  priceCurSymbol,
  title,
  description,
  apy,
  deposit,
  onClick,
  strikePrice,
  color,
  deliveryDate,
  timer
}: {
  logoCurSymbol: string
  priceCurSymbol: string
  title: string
  description: string
  apy: string
  deposit: string
  onClick: () => void
  color: string
  strikePrice: string
  deliveryDate: string
  timer: number
}) {
  return (
    <Box
      display="grid"
      width="100%"
      gap={32}
      margin={{ xs: '0px 20px' }}
      sx={{
        border: '1px solid transparent',
        background: theme => theme.palette.background.paper,
        borderRadius: 2,
        padding: '34px 24px',
        maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        // '&:hover': {
        //   cursor: 'pointer',
        //   borderColor: theme => theme.palette.primary.light
        // }
      }}
    >
      <ProductCardHeader
        logoCurSymbol={logoCurSymbol}
        description={description}
        title={title}
        priceCurSymbol={priceCurSymbol}
      />
      <Divider color="#cccccc10" extension={25} />

      <Box display={{ xs: 'grid' }} gap={24} gridTemplateColumns={{ xs: '100%', md: '35% auto' }}>
        <NumericalCard value={apy} subValue="Current APY" border valueColor={color} />
        <NumericalCard value={deposit} subValue="Your existing position" border>
          <Button style={{ borderRadius: 40 }} width={'132px'} height="36px" backgroundColor={color} onClick={onClick}>
            Add
          </Button>
        </NumericalCard>
        <NumericalCard value={strikePrice} subValue="Current Strike Price" border />
        <NumericalCard value={<Timer timer={timer} />} subValue="Countdown until delivery date" gray>
          <OutlinedCard color="rgba(0, 0, 0, 0.1)">
            <Box display="grid" padding="14px 18px" gap={4} height={60} minWidth={248}>
              <Typography sx={{ color: theme => theme.palette.text.secondary }} fontSize={12} textAlign={'left'}>
                Delivery Date
              </Typography>
              <Typography fontSize={12}> {deliveryDate}</Typography>
            </Box>
          </OutlinedCard>
        </NumericalCard>
      </Box>
    </Box>
  )
}
