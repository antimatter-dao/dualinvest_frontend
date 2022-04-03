import { useCallback, useMemo, useState } from 'react'
import { Box, Typography, styled } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import Spinner from 'components/Spinner'
import Table from 'components/Table'
import useBreakpoint from 'hooks/useBreakpoint'
import { Product, SingleCurProductList } from 'utils/fetch/product'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import { ExpireDateAQuestionHelper } from 'components/essential/QuestionHelper'
import Button from 'components/Button/Button'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import ProductCardHeader from 'components/ProductCardHeader'
import { useSwitchChainModal } from 'hooks/useSwitchChainModal'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'

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
  productList: SingleCurProductList | undefined
  strikeCurrencySymbol: string
}) {
  const isDownMd = useBreakpoint('md')
  const history = useHistory()
  const { chainId } = useActiveWeb3React()
  const { switchChainModalCallback } = useSwitchChainModal()

  const handleSubscribe = useCallback(
    (id: number, productChainId) => () => {
      if (chainId !== productChainId) {
        switchChainModalCallback(productChainId)
        return
      }

      history.push(routes.dualInvestMgmt.replace(':id', id + ''))
    },
    [chainId, history, switchChainModalCallback]
  )

  return (
    <Box
      display="grid"
      gap={{ xs: 36, md: 48 }}
      justifyItems={{ xs: 'flex-start', md: 'center' }}
      width="100%"
      alignContent="flex-start"
    >
      <Box
        id="up"
        display="grid"
        width="100%"
        gap={8}
        sx={{
          background: theme => theme.palette.background.paper,
          borderRadius: 2,
          padding: '34px 24px',
          margin: { xs: 0, md: '0 auto' },
          maxWidth: theme => ({ xs: '100%', sm: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        <ProductCardHeader
          logoCurSymbol={strikeCurrencySymbol}
          title={
            <>
              {strikeCurrencySymbol} Financial Management&nbsp;
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
        margin={{ xs: '0px auto' }}
        sx={{
          background: theme => theme.palette.background.paper,
          borderRadius: 2,
          padding: '34px 24px',
          margin: { xs: 0, md: '0 auto' },
          maxWidth: theme => ({ xs: '100%', sm: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        <ProductCardHeader
          logoCurSymbol={SUPPORTED_CURRENCIES.USDT.symbol ?? ''}
          title={
            <>
              {strikeCurrencySymbol} Financial Management&nbsp;
              <Box component="span" sx={{ fontWeight: 400 }}>
                {isDownMd && <br />}[downward exercise]
              </Box>
            </>
          }
          priceCurSymbol={strikeCurrencySymbol}
          description={` Deposit USDT, and settle the principal and income at maturity as ${strikeCurrencySymbol} or USDT`}
        />
        <DataTable onSubscribe={handleSubscribe} productList={productList?.put} />
      </Box>
    </Box>
  )
}

function DataTable({
  onSubscribe,
  productList
}: {
  onSubscribe: (id: number, productChainId: ChainId) => () => void
  productList: Product[] | undefined
}) {
  const [orderBy, setOrderBy] = useState(headers[0])
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const isDownMd = useBreakpoint('md')

  const formattedData = useMemo(() => {
    return productList
      ? productList.map((item: Product) => formatData(item, isDownMd, onSubscribe(item.productId, item.chainId)))
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
