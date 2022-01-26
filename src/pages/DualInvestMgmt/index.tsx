import { useState, useRef, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Grid } from '@mui/material'
import { Time } from 'lightweight-charts'
import { routes } from 'constants/routes'
import theme from 'theme'
import Card from 'components/Card/Card'
import LineChart from 'components/Chart'
import { useProduct } from 'hooks/useDualInvestData'
import Spinner from 'components/Spinner'
import { usePriceSet } from 'hooks/usePriceSet'
import useBreakpoint from 'hooks/useBreakpoint'
import SubscribeForm from './SubscribeForm'
import { Subject } from '../../components/MgmtPage/stableContent'
import MgmtPage from 'components/MgmtPage'

export default function DualInvestMgmt() {
  const [amount, setAmount] = useState('')

  const graphContainer = useRef<HTMLDivElement>(null)

  const { id } = useParams<{ id: string; orderId: string }>()

  const product = useProduct(id)
  // useSuccessImage(orderId)

  const priceSet = usePriceSet(product?.currency)
  const isDownMd = useBreakpoint('md')
  const strikePrice = product?.strikePrice ?? '-'
  const type = product?.type
  const gtStr = `${product && amount ? (+product.gtStrikePrice * +amount * +product.multiplier).toFixed(4) : '-'} ${
    product ? (product.type === 'CALL' ? product?.strikeCurrency : product?.investCurrency) : ''
  } `
  const ltStr = `${product && amount ? (+product?.ltStrikePrice * +amount * +product.multiplier).toFixed(4) : '-'} ${
    product ? (product.type === 'CALL' ? product?.investCurrency : product?.strikeCurrency) : ''
  }`

  const handleInput = useCallback(val => {
    setAmount(val)
  }, [])

  const strikeLineData = useMemo(() => {
    return product?.expiredAt && product?.strikePrice
      ? { time: product.expiredAt as Time, value: +product.strikePrice }
      : undefined
  }, [product?.expiredAt, product?.strikePrice])

  const chart = useMemo(() => {
    return (
      <>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            height: { xs: '300px', md: '100%', maxWidth: '100%', width: { xs: '100%', md: 'auto' } }
          }}
          ref={graphContainer}
        >
          {product && priceSet ? (
            <LineChart
              lineColor="#18A0FB"
              lineSeriesData={priceSet}
              unit="BTC"
              id="incomeGraph"
              height={graphContainer?.current?.offsetHeight ?? 280}
              strikeData={strikeLineData}
            />
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <Spinner size={60} marginRight="auto" marginLeft="auto" />
            </Box>
          )}
        </Grid>
        {!isDownMd && (
          <Grid item xs={12} md={4} sx={{ height: { xs: 'auto', md: '100%' } }} paddingBottom={{ xs: 0, md: 22 }}>
            <Box display={{ xs: 'flex', md: 'grid' }} gap={20}>
              <Card gray>
                <Box padding="16px" fontSize={14}>
                  Settlement price &gt; {strikePrice}, will be exercised. Estimated return {gtStr}
                </Box>
              </Card>
              <Card gray>
                <Box padding="16px" fontSize={14}>
                  Settlement price &le; {strikePrice}, will not be exercised. Estimated return {ltStr}
                </Box>
              </Card>
            </Box>
          </Grid>
        )}
      </>
    )
  }, [gtStr, isDownMd, ltStr, priceSet, product, strikeLineData, strikePrice])

  const returnOnInvestmentListItems = useMemo(() => {
    return [
      <>
        When the final settlement price &gt; {strikePrice} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>{gtStr}</span>.
      </>,
      <>
        When the settlement price is &le; {strikePrice} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>{ltStr}</span>.
      </>,
      <>
        APY will be refreshed instantly, and Antimatter will use the latest APY when you successfully complete the
        subscription.
      </>
    ]
  }, [gtStr, ltStr, strikePrice])

  return (
    <MgmtPage
      graphTitle="Purchase expected income graph"
      backLink={routes.dualInvest}
      product={product}
      pageTitle={`${product?.currency} Financial Management`}
      returnOnInvestmentListItems={returnOnInvestmentListItems}
      subject={Subject.DualInvest}
      type={type}
      chart={chart}
      subscribeForm={<SubscribeForm product={product} setAmount={handleInput} amount={amount} id={id} />}
    />
  )
}
