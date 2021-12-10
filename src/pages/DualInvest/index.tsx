import { useCallback } from 'react'
import { useHistory } from 'react-router'
import { Box, Typography, styled, Grid } from '@mui/material'
import { ReactComponent as DualInvestGuide } from 'assets/svg/dualInvestGuide.svg'
import checkUrl from 'assets/images/check.png'
import Image from 'components/Image'
import LogoText from 'components/LogoText'
import Table from 'components/Table'
import NumericalCard from 'components/Card/NumericalCard'
import Button from 'components/Button/Button'
import antimatterBlackCircle from 'assets/svg/antimatter_circle_black.svg'
import Card from 'components/Card/Card'
import securityUrl from 'assets/images/security.png'
import highReturnUrl from 'assets/images/high_return.png'
import flexibleUrl from 'assets/images/flexible.png'
import { /*Progress,*/ SimpleProgress } from 'components/Progress'
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { Product } from 'utils/fetch/product'
import Spinner from 'components/Spinner'
import { useProductList } from 'hooks/useDualInvestData'

const StyledDualInvestGuide = styled(DualInvestGuide)(({ theme }) => ({
  '& #dualInvestGuide': {
    zIndex: 2,
    '&:hover, :focus, :active': {
      opacity: 1,
      cursor: 'pointer'
    }
  },
  [theme.breakpoints.down('md')]: {
    width: 'calc(100vw - 72px)'
  }
}))

const RowStr = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontWeight: 400,
  [theme.breakpoints.down('md')]: {
    fontWeight: 600,
    fontSize: 12
  }
}))

const formatData = (data: Product, isDownMd: boolean, hanldeSubscribe: () => void) => {
  return [
    <RowStr key={1}>{data.strikePrice} USDT</RowStr>,
    <RowStr key={1}>{(+data.apy * 100).toFixed(2)}%</RowStr>,
    <RowStr key={1}>{data.expiredAt}</RowStr>,
    <RowStr key={1}>7 Days</RowStr>,
    // <CastValue key={1} unit="BTC" val={15.08} total={50} />,
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      key="1"
      flexDirection={isDownMd ? 'column' : 'row'}
      gap={20}
    >
      {isDownMd && <SimpleProgress val={15.08} total={50} hideValue width="100%" />}
      <Button
        height="36px"
        width={isDownMd ? '100%' : '120px'}
        style={{ borderRadius: 50, fontSize: 14 }}
        onClick={hanldeSubscribe}
      >
        Subscribe now
      </Button>
    </Box>
  ]
}

export default function DualInvest() {
  const history = useHistory()
  const isDownMd = useBreakpoint('md')
  const productList = useProductList()

  const handleSubscribe = useCallback(
    (id: number) => () => {
      history.push(routes.dualInvestMgmt.replace(':id', id + ''))
    },
    [history]
  )

  return (
    <Box
      display="grid"
      justifyItems="center"
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      gap={{ xs: 36, md: 48 }}
    >
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          width: '100%',
          background: theme => theme.palette.background.paper,
          padding: { xs: '20px', md: '44px 61px' }
        }}
      >
        <Box
          sx={{ maxWidth: theme => theme.width.maxContent }}
          width="100%"
          display={{ xs: 'grid', md: 'flex' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="grid" gap={12}>
            <Typography component="h1" sx={{ fontSize: { xs: 44 }, fontWeight: 700 }}>
              Dual Investment
            </Typography>
            <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 8, md: 32 }}>
              <LogoText
                logo={<Image src={checkUrl} />}
                text={<Typography sx={{ fontSize: 18, opacity: 0.8 }}>Earn both ups and downs</Typography>}
              />
              <LogoText
                logo={<Image src={checkUrl} />}
                text={<Typography sx={{ fontSize: 18, opacity: 0.8 }}>More control</Typography>}
              />
            </Box>
            <Grid container spacing={{ xs: 8, md: 20 }} mt={30}>
              <Grid item xs={12} md={6}>
                <NumericalCard value="9,657,321" unit="USDT" border subValue="Total investment amount" />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumericalCard value="168,640" unit="USDT" border subValue="Amount of investment in progress" />
              </Grid>
            </Grid>
          </Box>
          <StyledDualInvestGuide />
        </Box>
      </Box>

      <Box
        id="up"
        display="grid"
        width="100%"
        gap={44}
        sx={{
          background: theme => theme.palette.background.paper,
          borderRadius: 2,
          padding: '34px 24px',

          maxWidth: theme => ({ xs: `calc(100vw - 40px)`, md: theme.width.maxContent })
        }}
      >
        <Box display={{ xs: 'grid', md: 'flex' }} alignContent="center" justifyContent="space-between">
          <Box display="grid" columnGap={20} rowGap={8}>
            <Image
              src={antimatterBlackCircle}
              style={{
                gridRowStart: 1,
                gridRowEnd: isDownMd ? 'span 1' : 'span 2'
              }}
            />
            <Typography
              fontWeight={700}
              sx={{
                gridColumnStart: isDownMd ? 1 : 2,
                gridColumnEnd: 'span 1',
                fontSize: 24
              }}
            >
              BTC financial management&nbsp;
              <Box component="span" sx={{ fontWeight: 400 }}>
                {isDownMd && <br />}[upward exercise]
              </Box>
            </Typography>
            <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
              Deposit BTC, and settle the principal and income{isDownMd && <br />} at maturity as BTC or USDT
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography color="primary" fontSize={24} fontWeight={700} gap={8} display="flex" alignItems="center">
              <span> {productList?.btcPrice}</span>
              <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
                <path
                  d="M8.02174 3.81107L12.6559 6.40065V11.5896L8.04184 14.1889L3.40773 11.6287V6.4202L8.02174 3.81107ZM8.02174 0L6.3229 0.957655L1.69884 3.56678L0 4.52443V13.5244L1.69884 14.4723L6.33295 17.0521L8.03179 18L9.73063 17.0423L14.3446 14.4332L16.0435 13.4756V4.4658L14.3446 3.51792L9.71053 0.928339L8.02174 0Z"
                  fill="#375CD2"
                />
              </svg>
            </Typography>
            <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
              BTC latest spot price
            </Typography>
          </Box>
        </Box>
        <DataTable onSubscribe={handleSubscribe} productList={productList?.call} />
      </Box>

      <Box
        id="down"
        display="grid"
        width="100%"
        gap={44}
        sx={{
          background: theme => theme.palette.background.paper,
          borderRadius: 2,
          padding: '34px 24px',
          maxWidth: theme => ({ xs: `calc(100vw - 40px)`, md: theme.width.maxContent })
        }}
      >
        <Box display={{ xs: 'grid', md: 'flex' }} alignContent="center" justifyContent="space-between">
          <Box display="grid" columnGap={20} rowGap={8}>
            <Image
              src={antimatterBlackCircle}
              style={{
                gridRowStart: 1,
                gridRowEnd: 'span 2'
              }}
            />
            <Typography
              fontWeight={700}
              sx={{
                gridColumnStart: 2,
                gridColumnEnd: 'span 1',
                fontSize: 24
              }}
            >
              USDT financial management&nbsp;
              <Box component="span" sx={{ fontWeight: 400 }}>
                {isDownMd && <br />}[drop exercise]
              </Box>
            </Typography>
            <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
              Deposit USDT, and settle the principal and income {isDownMd && <br />}at maturity as BTC or USDT
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography color="primary" fontSize={24} fontWeight={700} gap={8} display="flex" alignItems="center">
              <span>{productList?.btcPrice}</span>
              <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
                <path
                  d="M8.02174 3.81107L12.6559 6.40065V11.5896L8.04184 14.1889L3.40773 11.6287V6.4202L8.02174 3.81107ZM8.02174 0L6.3229 0.957655L1.69884 3.56678L0 4.52443V13.5244L1.69884 14.4723L6.33295 17.0521L8.03179 18L9.73063 17.0423L14.3446 14.4332L16.0435 13.4756V4.4658L14.3446 3.51792L9.71053 0.928339L8.02174 0Z"
                  fill="#375CD2"
                />
              </svg>
            </Typography>
            <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
              USDT latest spot price
            </Typography>
          </Box>
        </Box>
        <DataTable onSubscribe={handleSubscribe} productList={productList?.put} />
      </Box>

      <Grid container sx={{ maxWidth: theme => theme.width.maxContent }} spacing={20} width="100%">
        <Grid item xs={12} md={4}>
          <FeatureCard
            icon={<Image src={securityUrl} />}
            title="Security"
            content="Top-level security infrastructure and risk control measures to protect asset safety"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard
            icon={<Image src={highReturnUrl} />}
            title="High Return"
            content="High-end liquidity strategy in the industry to ensure high returns"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard
            icon={<Image src={flexibleUrl} />}
            title="Flexible Experience"
            content="Low barriers to participation and strong flexibility"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

function DataTable({
  onSubscribe,
  productList
}: {
  onSubscribe: (id: number) => () => void
  productList: Product[] | undefined
}) {
  const isDownMd = useBreakpoint('md')

  return (
    <>
      {productList ? (
        <Table
          variant="outlined"
          header={['Exercise Price', 'APY', 'Delivery Date', 'Holding Days', '']}
          rows={
            productList
              ? productList.map((item: Product) => formatData(item, isDownMd, onSubscribe(item.productId)))
              : []
          }
        />
      ) : (
        <Spinner size={100} marginLeft="auto" marginRight="auto" />
      )}
    </>
  )
}

function FeatureCard({ icon, title, content }: { icon: JSX.Element; title: string; content: string }) {
  return (
    <Card style={{ height: '100%' }}>
      <Box display="grid" sx={{ '& img': { mixBlendMode: 'multiply' }, padding: '30px 24px' }} height="100%" gap={15}>
        {icon}
        <Typography sx={{ mt: 20 }} fontWeight={700} fontSize={24}>
          {title}
        </Typography>
        <Typography sx={{ color: theme => theme.palette.text.secondary, fontSize: 16 }}>{content}</Typography>
      </Box>
    </Card>
  )
}

// function CastValue({ unit, val, total }: { unit: string; val: number; total: number }) {
//   const isDownMd = useBreakpoint('md')
//   const percentage = ((val / total) * 100).toFixed(2)

//   if (isDownMd) {
//     return (
//       <RowStr>
//         {percentage}% {val} {unit} / {total} {unit}
//       </RowStr>
//     )
//   }
//   return <Progress unit={unit} val={val} total={total} />
// }
