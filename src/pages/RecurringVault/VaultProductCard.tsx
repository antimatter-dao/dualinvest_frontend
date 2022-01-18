import { Box } from '@mui/material'
import NumericalCard from 'components/Card/NumericalCard'
import { usePrice } from 'hooks/usePriceSet'
import ProductCardHeader from 'components/ProductCardHeader'

export default function VaultProductCard({
  logoCurSymbol,
  priceCurSymbol,
  title,
  description,
  apy,
  deposit,
  onClick,
  bgColor
}: {
  logoCurSymbol: string
  priceCurSymbol: string
  title: string
  description: string
  apy: string
  deposit: string
  onClick: () => void
  bgColor?: string
}) {
  const curPrice = usePrice(priceCurSymbol)

  return (
    <Box
      component="button"
      onClick={onClick}
      display="grid"
      width="100%"
      gap={32}
      margin={{ xs: '0px 20px' }}
      sx={{
        border: '1px solid transparent',
        background: theme => (bgColor ? bgColor : theme.palette.background.paper),
        borderRadius: 2,
        padding: '34px 24px',
        maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent }),
        '&:hover': {
          cursor: 'pointer',
          borderColor: theme => theme.palette.primary.light
        }
      }}
    >
      <ProductCardHeader
        logoCurSymbol={logoCurSymbol}
        curPrice={curPrice}
        description={description}
        title={title}
        priceCurSymbol={priceCurSymbol}
        fontColor={'#ffffff'}
      />
      <Box display={{ xs: 'grid', md: 'flex' }} gap={24} padding="0 50px">
        <NumericalCard value={apy} subValue="Current Projected Yield(APY)" border />
        <NumericalCard value={deposit} subValue="Your Deposit" border />
      </Box>
    </Box>
  )
}
