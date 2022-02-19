import { Box, Typography } from '@mui/material'
import NumericalCard from 'components/Card/NumericalCard'
import ProductCardHeader from 'components/ProductCardHeader'
import Divider from 'components/Divider'
import { Timer } from 'components/Timer'
import Button from 'components/Button/Button'
import { OutlinedCard } from 'components/Card/Card'
import { RecurProduct } from 'utils/fetch/recur'
import Spinner from 'components/Spinner'
import dayjs from 'dayjs'
import { toLocaleNumberString } from 'utils/toLocaleNumberString'
import { useRecurBalance } from 'hooks/useRecur'
import { CURRENCIES } from 'constants/currencies'
import useBreakpoint from 'hooks/useBreakpoint'

export default function VaultProductCard({
  logoCurSymbol,
  priceCurSymbol,
  title,
  description,
  onClick,
  color,
  product
}: {
  logoCurSymbol: string
  priceCurSymbol: string
  title: string
  description: string
  onClick: () => void
  color: string
  product: RecurProduct | undefined
}) {
  const { autoLockedBalance } = useRecurBalance(
    CURRENCIES[product?.currency ?? ''] ?? undefined,
    CURRENCIES[product?.investCurrency ?? ''] ?? undefined
  )
  const isDownMd = useBreakpoint('md')
  const isDownSm = useBreakpoint('sm')

  return (
    <Box
      display="grid"
      width="100%"
      gap={{ xs: '20px', md: '32px' }}
      margin={{ xs: '0px 20px' }}
      sx={{
        border: '1px solid transparent',
        background: theme => theme.palette.background.paper,
        borderRadius: 2,
        padding: '34px 24px',
        maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
      }}
    >
      <ProductCardHeader
        logoCurSymbol={logoCurSymbol}
        description={description}
        title={title}
        priceCurSymbol={priceCurSymbol}
        color={color}
      />
      <Divider color="#00000010" extension={25} style={{ marginBottom: 20 }} />

      {product ? (
        <Box display={{ xs: 'grid' }} gap={{ xs: 8, md: 24 }} gridTemplateColumns={{ xs: '100%', md: '35% auto' }}>
          <NumericalCard value={product?.apy ?? '-'} subValue="Current APY" border valueColor={color} />
          <NumericalCard
            value={`${
              autoLockedBalance === '-' ? '-' : toLocaleNumberString(autoLockedBalance)
            }  ${product?.investCurrency ?? '-'}`}
            subValue="Your existing position"
            border
          >
            <Button
              style={{ borderRadius: 40, marginTop: isDownMd ? 14 : 0 }}
              width={isDownSm ? '100%' : '132px'}
              height="36px"
              backgroundColor={color}
              onClick={onClick}
            >
              Add
            </Button>
          </NumericalCard>
          <NumericalCard
            value={toLocaleNumberString(product.strikePrice) + ' USDT'}
            subValue="Current Strike Price"
            border
          />
          <NumericalCard
            value={<Timer timer={product?.expiredAt ?? 0} />}
            subValue="Countdown until delivery date"
            gray
          >
            <OutlinedCard color="rgba(0, 0, 0, 0.1)" style={{ marginTop: isDownMd ? 14 : 0 }}>
              <Box display="grid" padding="14px 18px" gap={4} height={60} minWidth={248}>
                <Typography sx={{ color: theme => theme.palette.text.secondary }} fontSize={12} textAlign={'left'}>
                  Delivery Date
                </Typography>
                <Typography fontSize={12}>
                  {product?.expiredAt ? dayjs(product.expiredAt).format('MMM DD,YYYY') + ' 08:30 AM UTC' : '-'}
                </Typography>
              </Box>
            </OutlinedCard>
          </NumericalCard>
        </Box>
      ) : (
        <Box margin={'60px auto'}>
          <Spinner size={60} />
        </Box>
      )}
    </Box>
  )
}
