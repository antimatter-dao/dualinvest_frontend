import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { routes } from 'constants/routes'
import theme from 'theme'
import { useProduct } from 'hooks/useDualInvestData'
import SubscribeForm from './SubscribeForm'
import { Subject } from '../../components/MgmtPage/stableContent'
import MgmtPage from 'components/MgmtPage'
import DualInvestChart from './Chart'

export default function DualInvestMgmt() {
  const [amount, setAmount] = useState('')

  const { id } = useParams<{ id: string; orderId: string }>()

  const product = useProduct(id)

  const strikePrice = product?.strikePrice ?? '-'
  const type = product?.type
  const isCall = type === 'CALL'
  const gtStr = `${
    product && amount
      ? ((+product.price + 1) * (isCall ? +product.strikePrice : 1) * +amount * +product.multiplier).toFixed(4)
      : '-'
  } ${product ? (isCall ? product?.strikeCurrency : product?.currency) : ''} `
  const ltStr = `${
    product && amount
      ? ((isCall ? 1 : +product.strikePrice) * (1 + +product.price) * +amount * +product.multiplier).toFixed(4)
      : '-'
  } ${product ? product.investCurrency : ''}`

  const handleInput = useCallback(val => {
    setAmount(val)
  }, [])

  const chart = useMemo(() => {
    return (
      <DualInvestChart
        product={product}
        str1={`Settlement price ${isCall ? '≥' : '≤'} ${strikePrice}, will be exercised. Estimated return ${gtStr}`}
        str2={`Settlement price ${isCall ? '<' : '>'} ${strikePrice}, will not be exercised. Estimated return ${ltStr}`}
      />
    )
  }, [gtStr, isCall, ltStr, product, strikePrice])

  const returnOnInvestmentListItems = useMemo(() => {
    return [
      <>
        When the final settlement price {isCall ? '≥' : '≤'} {strikePrice} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>{gtStr}</span>.
      </>,
      <>
        When the settlement price {isCall ? '<' : '>'} {strikePrice} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>{ltStr}</span>.
      </>,
      <>
        APY will be refreshed instantly, and Antimatter will use the latest APY when you successfully complete the
        subscription.
      </>
    ]
  }, [gtStr, isCall, ltStr, strikePrice])

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
