import { useCallback, useEffect, useState, useMemo } from 'react'
import { useHistory } from 'react-router'
import { Box, Typography, styled, ButtonBase } from '@mui/material'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { Product } from 'utils/fetch/product'
import Spinner from 'components/Spinner'
import { useProductList } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
import { usePrice } from 'hooks/usePriceSet'
import NoDataCard from 'components/Card/NoDataCard'
import { useBindModal } from 'hooks/useReferralModal'
import { ExpireDateAQuestionHelper } from 'components/essential/QuestionHelper'
import { useParams } from 'react-router-dom'
import ProductBanner from 'components/ProductBanner'
import BlueRing from 'components/Icon/BlueRing'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { toLocaleNumberString } from 'utils/toLocaleNumberString'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'

enum TYPE {
  Saddle = 'Saddle',
  Tiered = 'Tiered'
}

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
  const [type, setType] = useState(TYPE.Saddle)
  const history = useHistory()
  const { type: typePath } = useParams<{ type: string }>()
  const productList = useProductList()
  const BTCPrice = usePrice('BTC')
  const ETHPrice = usePrice('ETH')
  useBindModal()
  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    if (typePath) {
      const pathStr = typePath.toLocaleLowerCase()
      if (pathStr === TYPE.Saddle.toLocaleLowerCase()) {
        setType(TYPE.Saddle)
        return
      }
      if (pathStr === TYPE.Tiered.toLocaleLowerCase()) {
        setType(TYPE.Tiered)
        return
      }
      history.push(routes.chainOption)
      setType(TYPE.Saddle)
    }
  }, [history, typePath])

  const handleSubscribe = useCallback(
    (id: number) => () => {
      history.push(routes.chainOptionMgmt.replace(':id', id + ''))
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
      <ProductBanner
        title="Chain-type Option"
        checkpoints={['Easy to access，enjoy high returns']}
        val1={BTCPrice ? toLocaleNumberString(BTCPrice) : '-'}
        subVal1={'BTC latest spot price'}
        unit1={
          <Box display={'flex'} alignItems="center" gap={'5px'} component="span">
            USDT
            <BlueRing />
          </Box>
        }
        val2={ETHPrice ? toLocaleNumberString(ETHPrice) : '-'}
        subVal2={'ETH latest spot price'}
        unit2={
          <Box display={'flex'} alignItems="center" gap={'5px'} component="span">
            USDT
            <BlueRing />
          </Box>
        }
      />
      <Box
        display="flex"
        gap={20}
        width="100%"
        sx={{ maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent }) }}
      >
        <OptionTab
          text={`${TYPE.Saddle} Option`}
          selected={type === TYPE.Saddle}
          onClick={() => setType(TYPE.Saddle)}
        />
        <OptionTab
          text={`${TYPE.Tiered} Option`}
          selected={type === TYPE.Tiered}
          onClick={() => setType(TYPE.Tiered)}
        />
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
        {SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID].map(symbol => {
          const list = productList?.[symbol as keyof typeof productList]

          return <DataTable onSubscribe={handleSubscribe} productList={list?.call} key={symbol} />
        })}
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

function OptionTab({ text, selected, onClick }: { text: string; selected?: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: 144,
        height: 44,
        background: theme => theme.palette.background.paper,
        borderRadius: '10px',
        border: theme => (selected ? `1px solid ${theme.palette.primary.main}` : 'none'),
        color: theme => (selected ? theme.palette.text.primary : theme.palette.text.secondary)
      }}
    >
      {text}
    </ButtonBase>
  )
}
