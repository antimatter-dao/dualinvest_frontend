import { useCallback, useEffect, useState, useMemo } from 'react'
import { useHistory } from 'react-router'
import { Box, Typography, styled, Grid } from '@mui/material'
import { ReactComponent as DualInvestGuide } from 'assets/svg/dualInvestGuide.svg'
import checkUrl from 'assets/images/check.png'
import Image from 'components/Image'
import LogoText from 'components/LogoText'
import Table from 'components/Table'
import NumericalCard from 'components/Card/NumericalCard'
import Button from 'components/Button/Button'
// import antimatterBlackCircle from 'assets/svg/antimatter_circle_black.svg'
import Card from 'components/Card/Card'
import securityUrl from 'assets/images/security.png'
import highReturnUrl from 'assets/images/high_return.png'
import flexibleUrl from 'assets/images/flexible.png'
// import { Progress, SimpleProgress } from 'components/Progress'
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { Product } from 'utils/fetch/product'
import Spinner from 'components/Spinner'
import { useProductList, useStatistics } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
import { BTC, USDT } from 'constants/index'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { usePrice } from 'hooks/usePriceSet'
import { trimNumberString } from 'utils/trimNumberString'
import NoDataCard from 'components/Card/NoDataCard'
import { useBindModal } from 'hooks/useReferralModal'
import { ExpireDateAQuestionHelper } from 'components/essential/QuestionHelper'

const StyledDualInvestGuide = styled(DualInvestGuide)(({ theme }) => ({
  marginBottom: 13,
  '& #dualInvestGuide': {
    zIndex: 2,
    '&:hover, :focus, :active': {
      opacity: 1,
      cursor: 'pointer'
    }
  },
  flexShrink: 1,
  [theme.breakpoints.down('md')]: {
    width: 'calc(100vw - 80px)',
    margin: '0 auto'
  }
}))

const RowStr = styled(Typography)<{ component?: string }>(({ theme }) => ({
  fontWeight: 400,
  [theme.breakpoints.down('md')]: {
    fontWeight: 600,
    fontSize: 12
  }
}))

const headers = ['Exercise Price', 'APY', 'Delivery Date', 'Time Left', '']

const comparisonFormatter = {
  [headers[0]]: (content: any) => {
    return content.props.children[0]
  },
  [headers[1]]: (content: any) => {
    return +content.props.children[0].slice(0, -1)
  },
  [headers[2]]: (content: any) => {
    return dayjs(content.props.children).valueOf()
  }
}

const formatData = (data: Product, isDownMd: boolean, hanldeSubscribe: () => void) => {
  return [
    <RowStr key={1}>{data.strikePrice} USDT</RowStr>,
    <RowStr key={1} minWidth={'50px'} color="#31B047">
      {(+data.apy * 100).toFixed(2)}%
    </RowStr>,
    <RowStr key={1} component="div">
      <ExpireDateAQuestionHelper expireAt={data.expiredAt} showIcon={false} />
      {/* <QuestionHelper
        text={dayjs(data.expiredAt).format('MMM-DD-YYYY') + ' 08:30:00 AM UTC'}
        title={<Typography color="#161616">{dayjs(data.expiredAt).format('DD MMM YYYY')}</Typography>}
      /> */}
    </RowStr>,
    <RowStr key={1}>{Math.floor((data.expiredAt - data.ts) / 86400000)} Days</RowStr>,
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
      {/* {isDownMd && <SimpleProgress val={15.08} total={50} hideValue width="100%" />} */}
      <Button
        height="36px"
        width={isDownMd ? '100%' : '120px'}
        style={{ borderRadius: 50, fontSize: 14, marginLeft: 'auto' }}
        onClick={hanldeSubscribe}
      >
        Subscribe now
      </Button>
    </Box>
  ]
}

export default function DualInvest() {
  const history = useHistory()
  const isDownSm = useBreakpoint('sm')
  const isDownMd = useBreakpoint('md')
  const productList = useProductList()
  const statistics = useStatistics()
  const BTCPrice = usePrice('BTC')
  useBindModal()

  const handleSubscribe = useCallback(
    (id: number) => () => {
      history.push(routes.dualInvestMgmt.replace(':id', id + ''))
    },
    [history]
  )

  useEffect(() => {
    const el = document.getElementById('dualInvestGuide')
    if (!el) return
    const redirect = () => {
      window.open('https://docs.antimatter.finance/antimatter-dual-investment/rules', '_blank')
    }
    el.addEventListener('click', redirect)
    return () => {
      el.removeEventListener('click', redirect)
    }
  })

  return (
    <Box
      display="grid"
      justifyItems={{ xs: 'flex-start', md: 'center' }}
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
          padding: { xs: '20px', md: '40px', lg: '44px 61px' }
        }}
      >
        <Box
          sx={{ maxWidth: theme => ({ xs: 'calc(100vw - 88px)', md: theme.width.maxContent }) }}
          width="100%"
          display={{ xs: 'grid', sm: 'flex' }}
          justifyContent={{ sm: 'center', md: 'space-between' }}
          alignItems="center"
        >
          <Box display="grid" gap={12}>
            <Typography component="h1" sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700 }}>
              Dual Investment
            </Typography>
            <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 8, md: 32 }} paddingBottom={{ xs: 16, md: 30 }}>
              <LogoText
                logo={<Image src={checkUrl} />}
                text={
                  <Typography sx={{ fontSize: { xs: 14, md: 18 }, opacity: 0.8 }}>
                    Earn fixed yield on idle assets
                  </Typography>
                }
              />
              <LogoText
                logo={<Image src={checkUrl} />}
                text={
                  <Typography sx={{ fontSize: { xs: 14, md: 18 }, opacity: 0.8 }}>
                    Earn on both ups and downs
                  </Typography>
                }
              />
            </Box>
            <Grid container spacing={{ xs: 8, md: 20 }}>
              <Grid item xs={12} md={6}>
                <NumericalCard
                  width={isDownMd ? '320px' : '264px'}
                  value={
                    statistics && BTCPrice
                      ? trimNumberString(
                          (+statistics.totalBtcDeposit * +BTCPrice + +statistics.totalUsdtDeposit).toLocaleString(),
                          0
                        )
                      : '-'
                  }
                  unit="USDT"
                  border
                  subValue="Cumulative Deposit Amount"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumericalCard
                  width={isDownMd ? '320px' : '264px'}
                  value={statistics ? trimNumberString((+statistics.totalInvestAmount).toLocaleString(), 0) : '-'}
                  unit="USDT"
                  border
                  subValue="Cumulative Investment Amount"
                />
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
        gap={8}
        margin={{ xs: '0px 20px' }}
        sx={{
          background: theme => theme.palette.background.paper,
          borderRadius: 2,
          padding: '34px 24px',
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        <Box
          display={{ xs: 'grid', sm: 'flex' }}
          alignContent="center"
          justifyContent={{ xs: 'stretch', sm: 'space-between' }}
          gap={{ xs: '0', sm: '40px' }}
        >
          <Box display="grid" columnGap={20} rowGap={8}>
            <CurrencyLogo
              currency={BTC}
              size="64px"
              style={{
                gridRowStart: 1,
                gridRowEnd: isDownSm ? 'span 1' : 'span 2',
                marginBottom: isDownSm ? 12 : 0
              }}
            />
            <Typography
              fontWeight={700}
              sx={{
                gridColumnStart: isDownSm ? 1 : 2,
                gridColumnEnd: 'span 1',
                fontSize: 24
              }}
            >
              BTC Financial Management&nbsp;
              <Box component="span" sx={{ fontWeight: 400 }}>
                {isDownMd && <br />}[upward exercise]
              </Box>
            </Typography>
            <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
              Deposit BTC, and settle the principal and income at maturity as BTC or USDT
            </Typography>
          </Box>
          <Card gray={isDownSm} style={{ borderRadius: '16px', margin: isDownMd ? '16px 0' : 0 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={isDownMd ? 'flex-start' : 'flex-end'}
              padding={{ xs: '16px', sm: '16px 0' }}
              gap={isDownMd ? 10 : 0}
            >
              <Typography color="primary" fontSize={24} fontWeight={700} gap={8} display="flex" alignItems="center">
                <span style={{ width: 120 }}>
                  {' '}
                  {BTCPrice ? trimNumberString((+BTCPrice).toLocaleString(), 2) : '-'}
                </span>
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
          </Card>
        </Box>
        <DataTable onSubscribe={handleSubscribe} productList={productList?.call} />
      </Box>

      <Box
        id="down"
        display="grid"
        width="100%"
        gap={8}
        margin={{ xs: '0px 20px' }}
        sx={{
          background: theme => theme.palette.background.paper,
          borderRadius: 2,
          padding: '34px 24px',
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        <Box
          display={{ xs: 'grid', sm: 'flex' }}
          alignContent="center"
          justifyContent="space-between"
          gap={{ xs: '0', sm: '40px' }}
        >
          <Box display="grid" columnGap={20} rowGap={8}>
            <CurrencyLogo
              currency={USDT}
              size="64px"
              style={{
                gridRowStart: 1,
                gridRowEnd: isDownSm ? 'span 1' : 'span 2',
                marginBottom: isDownSm ? 12 : 0
              }}
            />
            <Typography
              fontWeight={700}
              sx={{
                gridColumnStart: isDownSm ? 1 : 2,
                gridColumnEnd: 'span 1',
                fontSize: 24
              }}
            >
              BTC Financial Management&nbsp;
              <Box component="span" sx={{ fontWeight: 400 }}>
                {isDownMd && <br />}[down exercise]
              </Box>
            </Typography>
            <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
              Deposit USDT, and settle the principal and income at maturity as BTC or USDT
            </Typography>
          </Box>
          <Card gray={isDownSm} style={{ borderRadius: '16px', margin: isDownMd ? '16px 0' : 0 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={isDownMd ? 'flex-start' : 'flex-end'}
              padding={{ xs: '16px', sm: '16px 0' }}
              gap={isDownMd ? 10 : 0}
            >
              <Typography color="primary" fontSize={24} fontWeight={700} gap={8} display="flex" alignItems="center">
                <span style={{ width: 120 }}>{BTCPrice ? trimNumberString((+BTCPrice).toLocaleString(), 2) : '-'}</span>
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
          </Card>
        </Box>
        <DataTable onSubscribe={handleSubscribe} productList={productList?.put} />
      </Box>
      <Box
        display="flex"
        alignContent="center"
        justifyContent="center"
        maxWidth={theme => ({ xs: `calc(100vw - 40px)`, md: theme.width.maxContent })}
        margin={{ xs: '0px 20px' }}
      >
        <Grid container sx={{ justifyContent: 'space-between' }} spacing={20}>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={
                <Image
                  src={securityUrl}
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: 'contain',
                    WebkitTransform: 'scaleX(-1)',
                    transform: 'scaleX(-1)'
                  }}
                />
              }
              title="Security"
              content="Top-level security infrastructure and risk control measures to protect asset safety"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<Image src={highReturnUrl} style={{ width: 56, height: 56, objectFit: 'contain' }} />}
              title="High Return"
              content="We ensure your APY gets locked in on subscription. Enjoy high fixed yield!"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<Image src={flexibleUrl} style={{ width: 56, height: 56, objectFit: 'contain' }} />}
              title="Flexible Experience"
              content="High flexibility and low barriers for participation "
            />
          </Grid>
        </Grid>
      </Box>
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
  const [orderBy, setOrderBy] = useState(headers[0])
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const isDownMd = useBreakpoint('md')

  const formattedData = useMemo(() => {
    return productList
      ? productList.map((item: Product) => formatData(item, isDownMd, onSubscribe(item.productId)))
      : []
  }, [isDownMd, onSubscribe, productList])

  const sortedData = useMemo(() => {
    const idx = headers.findIndex(item => item === orderBy)
    if (idx === undefined) return formattedData
    return formattedData?.sort((el1, el2) => {
      if (comparisonFormatter[orderBy](el1[idx]) > comparisonFormatter[orderBy](el2[idx])) {
        return order === 'asc' ? 1 : -1
      } else {
        return order === 'asc' ? -1 : 1
      }
    })
  }, [formattedData, order, orderBy])

  const createSortfunction = useCallback((sortLabel: string) => {
    const idx = headers.findIndex(item => item === sortLabel)
    if (idx === undefined) return () => {}
    return () => {
      setOrderBy(sortLabel)
      setOrder(prevOrder => {
        return prevOrder === 'asc' ? 'desc' : 'asc'
      })
    }
  }, [])

  return (
    <>
      {productList ? (
        <>
          <Table
            createSortfunction={createSortfunction}
            order={order}
            orderBy={orderBy}
            sortHeaders={['Exercise Price', 'APY', 'Delivery Date']}
            variant="outlined"
            header={headers}
            rows={sortedData}
          />
          {productList.length <= 0 && <NoDataCard outlined />}
        </>
      ) : (
        <Spinner marginLeft="auto" marginRight="auto" size={60} style={{ marginTop: '40px' }} />
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
