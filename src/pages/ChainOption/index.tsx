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
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { Product } from 'utils/fetch/product'
import Spinner from 'components/Spinner'
import { useProductList, useStatistics } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
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

export default function ChainOption() {
  const history = useHistory()
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
      id="chain_option"
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
              Chain-type Option
            </Typography>
            <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 8, md: 32 }} paddingBottom={{ xs: 16, md: 30 }}>
              <LogoText
                logo={<Image src={checkUrl} />}
                text={
                  <Typography sx={{ fontSize: { xs: 14, md: 18 }, opacity: 0.8 }}>
                    Easy to access，enjoy high returns
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
                  subValue="BTC latest spot price"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumericalCard
                  width={isDownMd ? '320px' : '264px'}
                  value={statistics ? trimNumberString((+statistics.totalInvestAmount).toLocaleString(), 0) : '-'}
                  unit="USDT"
                  border
                  subValue="ETH latest spot price"
                />
              </Grid>
            </Grid>
          </Box>
          <StyledDualInvestGuide />
        </Box>
      </Box>

      <Box
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
        <DataTable onSubscribe={handleSubscribe} productList={productList?.call} />
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
