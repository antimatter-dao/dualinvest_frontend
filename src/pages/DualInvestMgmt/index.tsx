import { useState, useRef, useMemo, useCallback } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Box, Typography, Grid, styled } from '@mui/material'
import { Time } from 'lightweight-charts'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import { routes } from 'constants/routes'
import theme from 'theme'
import Card, { OutlinedCard } from 'components/Card/Card'
import Divider from 'components/Divider'
import LineChart from 'components/Chart'
import { useProduct } from 'hooks/useDualInvestData'
import Spinner from 'components/Spinner'
import { usePriceSet } from 'hooks/usePriceSet'
import useBreakpoint from 'hooks/useBreakpoint'
import SubscribeForm from './SubscribeForm'
import { RiskStatement, FAQ } from './stableContent'
// import { useSuccessImage } from 'hooks/useSuccessImage'

const StyledUnorderList = styled('ul')(({ theme }) => ({
  paddingLeft: '18px',
  color: '#808080',
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

  const returnOnInvestment = useMemo(() => {
    return (
      <div>
        <Typography fontSize={16} color={theme.palette.text.primary}>
          Return on investment:
        </Typography>
        <StyledUnorderList>
          <li>
            When the final settlement price &gt; {strikePrice} USDT, you will receive{' '}
            <span style={{ color: theme.palette.text.primary }}>{gtStr}</span>.
          </li>
          <li>
            When the settlement price is &le; {strikePrice} USDT, you will receive{' '}
            <span style={{ color: theme.palette.text.primary }}>{ltStr}</span>.
          </li>
          <li>
            APY will be refreshed instantly, and Antimatter will use the latest APY when you successfully complete the
            subscription.
          </li>
        </StyledUnorderList>
      </div>
    )
  }, [gtStr, ltStr, strikePrice])

  return (
    <>
      <Box
        display="grid"
        width="100%"
        alignContent="flex-start"
        marginBottom="auto"
        justifyItems="center"
        padding={{ xs: '24px 20px', md: 0 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: isDownMd ? theme.palette.background.default : theme.palette.background.paper,
            padding: isDownMd ? '0 0 28px 0' : '27px 0'
          }}
        >
          <Box maxWidth={theme.width.maxContent} width="100%">
            <NavLink to={routes.dualInvest} style={{ textDecoration: 'none' }}>
              <ArrowLeft />
              <Typography component="span" color={theme.bgColor.bg1} fontSize={{ xs: 12, md: 14 }} ml={16}>
                Go Back
              </Typography>
            </NavLink>
          </Box>
        </Box>
        <Box padding={isDownMd ? 0 : '60px 0'} sx={{ maxWidth: theme.width.maxContent }} width="100%">
          <Box mb={isDownMd ? 24 : 60} display="flex" gap={8} flexDirection={isDownMd ? 'column' : 'row'}>
            <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={700}>
              {product?.currency} Financial Management
            </Typography>
            <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={400} component="span">
              [{type === 'CALL' ? 'upward' : 'down'} exercise]
            </Typography>
          </Box>
          <Grid container spacing={20}>
            <Grid xs={12} md={4} item position="relative">
              {!product && (
                <Box
                  position="absolute"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    top: 20,
                    left: 20,
                    width: 'calc(100% - 20px)',
                    height: 'calc(100% - 20px)',
                    background: '#ffffff',
                    zIndex: 3,
                    borderRadius: 2
                  }}
                >
                  <Spinner size={60} />
                </Box>
              )}
              <Card style={{ height: '100%' }}>
                <SubscribeForm product={product} setAmount={handleInput} amount={amount} id={id} />
              </Card>
            </Grid>

            <Grid xs={12} md={8} item>
              <Card style={{ height: '100%' }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  maxWidth="100%"
                  height="100%"
                  width="100%"
                  padding="32px 24px"
                >
                  <Box
                    display="flex"
                    justifyContent={isDownMd ? 'flex-start' : 'space-between'}
                    flexDirection={isDownMd ? 'column' : 'row'}
                    gap={18}
                  >
                    <Typography fontSize={{ xs: 20, md: 24 }} fontWeight={700}>
                      Purchase expected income graph
                    </Typography>
                    <Box display="flex" alignItems="center" gap={24}>
                      <Box display="flex" alignItems="center" gap={8}>
                        <Box height={10} width={10} borderRadius="50%" bgcolor="#18A0FB" />
                        <Typography fontSize={12} color="#18A0FB">
                          Spot Price
                        </Typography>
                      </Box>
                      <Box fontSize={12} display="flex" alignItems="center" gap={8}>
                        <Box height={10} width={10} borderRadius="50%" bgcolor="#F0B90B" />
                        <Typography fontSize={12} color="#F0B90B">
                          Strike Price
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ maxWidth: '100vw', height: '100%', flexGrow: 1 }} mt={20}>
                    <Box
                      maxHeight="100%"
                      height="100%"
                      gap={20}
                      display={{ xs: 'grid', md: 'flex', maxWidth: 'calc(100vw - 100px)' }}
                    >
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
                        <Grid
                          item
                          xs={12}
                          md={4}
                          sx={{ height: { xs: 'auto', md: '100%' } }}
                          paddingBottom={{ xs: 0, md: 22 }}
                        >
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
                    </Box>
                  </Box>
                  {isDownMd ? (
                    <Box>
                      <Divider extension={24} sx={{ opacity: 0.1, marginBottom: 20 }} />
                      {returnOnInvestment}
                    </Box>
                  ) : (
                    <OutlinedCard padding="16px 20px">{returnOnInvestment}</OutlinedCard>
                  )}
                </Box>
              </Card>
            </Grid>

            <Grid xs={12} item>
              <Card style={{ height: '100%' }}>
                <RiskStatement />
              </Card>
            </Grid>
            <Grid xs={12} item>
              <Card style={{ height: '100%' }} padding="32px 24px">
                <FAQ />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
