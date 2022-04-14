import { Box, Grid } from '@mui/material'
import Card from 'components/Card/Card'
import LineChart from 'components/Chart'
import BarChart from 'components/Chart/BarChart'
import Spinner from 'components/Spinner'
import useBreakpoint from 'hooks/useBreakpoint'
import { usePriceSet } from 'hooks/usePriceSet'
import { Time } from 'lightweight-charts'
import { useMemo, useRef } from 'react'

export default function DualInvestChart({
  product,
  str1,
  str2
}: {
  product: { [key: string]: any; currency: string; expiredAt: number; strikePrice: string } | undefined
  str1: string
  str2: string
}) {
  const graphContainer = useRef<HTMLDivElement>(null)
  const priceSet = usePriceSet(product?.currency)
  const isDownMd = useBreakpoint('md')

  const strikeLineData = useMemo(() => {
    return product?.expiredAt && product?.strikePrice
      ? { time: product.expiredAt as Time, value: +product.strikePrice }
      : undefined
  }, [product?.expiredAt, product?.strikePrice])

  return (
    <>
      <Grid
        item
        xs={12}
        md={9}
        sx={{
          height: {
            xs: '300px',
            md: '100%',
            maxWidth: { xs: '100%', md: 'calc(100% - 100px)' },
            width: { xs: '100%', md: 'auto' }
          }
        }}
        ref={graphContainer}
      >
        {product && priceSet ? (
          <LineChart
            lineColor="#18A0FB"
            lineSeriesData={priceSet}
            unit={product.currency}
            id={product.currency + 'PriceGraph'}
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
        <Grid item xs={12} md={3} sx={{ height: { xs: 'auto', md: '100%' } }} paddingBottom={{ xs: 0, md: 22 }}>
          <Box display={{ xs: 'flex', md: 'grid' }} gap={20} maxWidth="100%">
            <Card gray width="100%">
              <Box padding="16px" fontSize={14} sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                {str1}
              </Box>
            </Card>
            <Card gray width="100%">
              <Box
                padding="16px"
                fontSize={14}
                maxWidth="100%"
                sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}
              >
                {str2}
              </Box>
            </Card>
          </Box>
        </Grid>
      )}
    </>
  )
}

export function PastAggrChart() {
  const graphContainer = useRef<HTMLDivElement>(null)

  return (
    <>
      <Grid
        item
        sx={{
          height: { xs: '100%', md: '100%' },
          maxWidth: '100%',
          width: { xs: '100%', md: 'auto' }
        }}
        ref={graphContainer}
      >
        <BarChart />
      </Grid>
    </>
  )
}
