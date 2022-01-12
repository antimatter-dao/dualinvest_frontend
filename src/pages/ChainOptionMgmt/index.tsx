import { useState, useRef, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Grid, styled } from '@mui/material'
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

const StyledUnorderList = styled('ul')(({ theme }) => ({
  paddingLeft: '14px',
  color: '#808080',
  '& li': {
    marginTop: 10,
    fontSize: 15.5
  },
  '& li span': {
    color: '#252525'
  },
  '& li::marker': {
    color: theme.palette.primary.main
  }
}))

export default function DualInvestMgmt() {
  const [amount, setAmount] = useState('')

  const graphContainer = useRef<HTMLDivElement>(null)

  const { id } = useParams<{ id: string; orderId: string }>()

  const product = useProduct(id)
  // useSuccessImage(orderId)

  const priceSet = usePriceSet(product?.currency)
  const isDownMd = useBreakpoint('md')
  const strikePrice = product?.strikePrice ?? '-'
  // const type = product?.type
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

  const returnOnInvestment = useMemo(() => {
    return (
      <div>
        <Typography fontSize={16} color={theme.palette.text.primary}>
          Return on investment:
        </Typography>
        <StyledUnorderList>
          <li>Start at 11-29 09:00.</li>
          <li>
            If the BTC price can keep rising within 24 hours, you will receive a reward of up to{' '}
            <span style={{ color: theme.palette.text.primary }}>220.00 USDT</span>.
          </li>
          <li>If the BTC price down in a certain range, it will be eliminated and your total income will be settled</li>
          <li>
            If the first interval down, you will get&nbsp;
            <span style={{ color: theme.palette.text.primary }}>20 USDT</span> compensation
          </li>
        </StyledUnorderList>
      </div>
    )
  }, [])

  return (
    <MgmtPage
      backLink={routes.chainOption}
      product={product}
      pageTitle={`${product?.currency} Saddle Option`}
      returnOnInvestment={returnOnInvestment}
      subject={Subject.ChainOption}
      chart={chart}
      subscribeForm={<SubscribeForm product={product} setAmount={handleInput} amount={amount} id={id} />}
    />
  )
}
