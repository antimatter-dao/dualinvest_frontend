import ClaimSuccessModal from 'pages/Account/ClaimSuccessModal'
import { useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import CryptoJs from 'crypto-js'
import { Axios } from 'utils/axios'
import { OrderRecord } from 'utils/fetch/product'
import useModal from './useModal'
import { USDT, BTC } from 'constants/index'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'

export function useSuccessImage(orderId: string) {
  const [, setOrder] = useState(undefined)

  const { showModal } = useModal()

  const promiseFn = useCallback(() => {
    if (!orderId)
      return new Promise((r, reject) => {
        reject('')
      })
    const id = CryptoJs.AES.decrypt(orderId.replaceAll('+', '/'), 'Antimatter dual').toString()
    return Axios.get<{ records: OrderRecord[] }>('getOrderRecord', {
      orderId: id
    })
  }, [orderId])

  const callbackFn = useCallback(
    r => {
      setOrder(r.data.data.records[0])
      const {
        returnedAmount,
        returnedCurrency,
        amount,
        currency,
        annualRor,
        expiredAt,
        strikePrice,
        productId,
        deliveryPrice,
        multiplier,
        investCurrency,
        orderId,
        type
      } = r.data.data.records[0]
      if (+returnedAmount === 0) return
      const apy = `${(+annualRor * 100).toFixed(2)}%`
      const investAmount = `${(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(
        1
      )} ${investCurrency}`
      const deliveryDate = dayjs(+expiredAt * 1000).format('MMM DD, YYYY')
      const exercised = type === 'CALL' ? !!(+deliveryPrice > +strikePrice) : !!(+deliveryPrice < +strikePrice)
      const earned = (+returnedAmount - amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(
        6
      )

      showModal(
        <ClaimSuccessModal
          showShare={false}
          orderId={orderId}
          productId={productId + ''}
          apy={apy}
          strikePrice={strikePrice}
          type={type}
          currency={currency}
          deliveryDate={deliveryDate}
          investAmount={investAmount}
          earn={earned}
          exercised={exercised}
          returnedCurrency={returnedCurrency == BTC.address ? BTC.symbol ?? '' : USDT.symbol ?? ''}
        />
      )
      // const meta1 = document.createElement('meta')
      // meta1.name = 'twitter:card'
      // meta1.content = 'summary_large_image'

      // const meta2 = document.createElement('meta')
      // meta2.name = 'twitter:image'
      // meta2.content =
      //   'http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg"'

      // const meta3 = document.createElement('meta')
      // meta3.name = 'twitter:title'
      // meta3.content = `Antimattter Dual Investment | The benefits are great ! +${earned} ${returnedCurrency}, APY:${apy}`

      // document.getElementsByTagName('head')[0].appendChild(meta1)
      // document.getElementsByTagName('head')[0].appendChild(meta2)
    },
    [showModal]
  )

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return
}

export function useShowClaimSuccessModal() {
  const { showModal } = useModal()
  const showClaimSuccessModalCallback = useCallback(
    (order: OrderRecord | undefined) => () => {
      if (!order || +order.returnedAmount === 0) return
      const {
        returnedAmount,
        returnedCurrency,
        amount,
        currency,
        annualRor,
        expiredAt,
        strikePrice,
        productId,
        deliveryPrice,
        multiplier,
        investCurrency,
        type,
        orderId
      } = order
      if (+returnedAmount === 0) return
      const apy = `${(+annualRor * 100).toFixed(2)}%`
      const investAmount = `${(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(
        1
      )} ${investCurrency}`
      const deliveryDate = dayjs(+expiredAt * 1000).format('MMM DD, YYYY')
      const exercised = type === 'CALL' ? !!(+deliveryPrice > +strikePrice) : !!(+deliveryPrice < +strikePrice)
      const earned = (+returnedAmount - amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(
        6
      )

      showModal(
        <ClaimSuccessModal
          orderId={orderId + ''}
          productId={productId + ''}
          apy={apy}
          strikePrice={strikePrice}
          type={type}
          currency={currency}
          deliveryDate={deliveryDate}
          investAmount={investAmount}
          earn={earned}
          exercised={exercised}
          returnedCurrency={returnedCurrency == BTC.address ? BTC.symbol ?? '' : USDT.symbol ?? ''}
        />
      )
    },
    [showModal]
  )

  return useMemo(
    () => ({
      showClaimSuccessModalCallback
    }),
    [showClaimSuccessModalCallback]
  )
}
