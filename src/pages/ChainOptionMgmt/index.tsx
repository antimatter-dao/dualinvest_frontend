import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { routes } from 'constants/routes'
import theme from 'theme'

import { useProduct } from 'hooks/useDualInvestData'

import SubscribeForm from './SubscribeForm'
import { Subject } from '../../components/MgmtPage/stableContent'
import MgmtPage from 'components/MgmtPage'

export default function DualInvestMgmt() {
  const [amount, setAmount] = useState('')

  const { id } = useParams<{ id: string; orderId: string }>()

  const product = useProduct(id)
  // useSuccessImage(orderId)

  const handleInput = useCallback(val => {
    setAmount(val)
  }, [])

  const returnOnInvestmentListItems = useMemo(() => {
    return [
      <>Start at 11-29 09:00.</>,
      <>
        If the BTC price can keep rising within 24 hours, you will receive a reward of up to{' '}
        <span style={{ color: theme.palette.text.primary }}>220.00 USDT</span>.
      </>,
      <>If the BTC price down in a certain range, it will be eliminated and your total income will be settled</>,
      <>
        If the first interval down, you will get&nbsp;
        <span style={{ color: theme.palette.text.primary }}>20 USDT</span> compensation
      </>
    ]
  }, [])

  return (
    <MgmtPage
      graphTitle="Purchase expected income graph"
      backLink={routes.chainOption}
      product={product}
      pageTitle={`${product?.currency ?? '-'} Saddle Option`}
      returnOnInvestmentListItems={returnOnInvestmentListItems}
      subject={Subject.ChainOption}
      chart={<></>}
      subscribeForm={<SubscribeForm product={product} setAmount={handleInput} amount={amount} id={id} />}
    />
  )
}
