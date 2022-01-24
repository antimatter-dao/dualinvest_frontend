import { useCallback, useMemo, useState } from 'react'
import { Box, Typography, styled } from '@mui/material'
import Card from 'components/Card/Card'
import NoDataCard from 'components/Card/NoDataCard'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Spinner from 'components/Spinner'
import Table from 'components/Table'
import useBreakpoint from 'hooks/useBreakpoint'
import { Product, ProductList } from 'utils/fetch/product'
import { CURRENCIES } from 'constants/currencies'
import { ExpireDateAQuestionHelper } from 'components/essential/QuestionHelper'
import Button from 'components/Button/Button'
import { trimNumberString } from 'utils/trimNumberString'
import { usePrice } from 'hooks/usePriceSet'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import ProductCardHeader from 'components/ProductCardHeader'

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
    return content.props.children.props.expireAt
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
    </RowStr>,
    <RowStr key={1}>{Math.floor((data.expiredAt - data.ts) / 86400000)} Days</RowStr>,
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      key="1"
      flexDirection={isDownMd ? 'column' : 'row'}
      gap={20}
    >
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

export default function ProductTable({
  productList,
  strikeCurrencySymbol
}: {
  productList: ProductList | undefined
  strikeCurrencySymbol: string
}) {
  const isDownSm = useBreakpoint('sm')
  const isDownMd = useBreakpoint('md')
  const curPrice = usePrice(strikeCurrencySymbol)
  const history = useHistory()

  const handleSubscribe = useCallback(
    (id: number) => () => {
      history.push(routes.dualInvestMgmt.replace(':id', id + ''))
    },
    [history]
  )

  return (
    <>
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
        <ProductCardHeader
          logoCurSymbol={strikeCurrencySymbol}
          curPrice={curPrice}
          title={
            <>
              BTC Financial Management&nbsp;
              <Box component="span" sx={{ fontWeight: 400 }}>
                {isDownMd && <br />}[upward exercise]
              </Box>
            </>
          }
          priceCurSymbol={strikeCurrencySymbol}
          description={`Deposit ${strikeCurrencySymbol}, and settle the principal and income at maturity as ${strikeCurrencySymbol}
  or USDT`}
        />
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
              currency={CURRENCIES.USDT}
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
                <span style={{ width: 120 }}>
                  {curPrice ? trimNumberString((+curPrice).toLocaleString('en-US'), 2) : '-'}
                </span>
                <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
                  <path
                    d="M8.02174 3.81107L12.6559 6.40065V11.5896L8.04184 14.1889L3.40773 11.6287V6.4202L8.02174 3.81107ZM8.02174 0L6.3229 0.957655L1.69884 3.56678L0 4.52443V13.5244L1.69884 14.4723L6.33295 17.0521L8.03179 18L9.73063 17.0423L14.3446 14.4332L16.0435 13.4756V4.4658L14.3446 3.51792L9.71053 0.928339L8.02174 0Z"
                    fill="#375CD2"
                  />
                </svg>
              </Typography>
              <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
                {strikeCurrencySymbol} latest spot price
              </Typography>
            </Box>
          </Card>
        </Box>
        <DataTable onSubscribe={handleSubscribe} productList={productList?.put} />
      </Box>
    </>
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
