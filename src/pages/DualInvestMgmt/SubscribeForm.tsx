import { useMemo, useState, useCallback, useEffect } from 'react'
import dayjs from 'dayjs'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Typography, useTheme } from '@mui/material'
import { Product } from 'utils/fetch/product'
import ActionButton from 'components/Button/ActionButton'
import InputLabel from 'components/Input/InputLabel'
import TextButton from 'components/Button/TextButton'
import Divider from 'components/Divider'
import InputNumerical from 'components/Input/InputNumerical'
import { BlackButton } from 'components/Button/Button'
import { OutlinedCard } from 'components/Card/Card'
import ConfirmModal from './ConfirmModal'
import { useActiveWeb3React } from 'hooks'
import { BTC, USDT } from 'constants/index'
import { Axios } from 'utils/axios'
import useModal from 'hooks/useModal'
import ActionModal, { ActionType } from 'pages/Account/ActionModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useDualInvestBalance } from 'hooks/useDualInvest'
import { tryParseAmount } from 'utils/parseAmount'
import { useAddPopup, useWalletModalToggle } from 'state/application/hooks'
import { InvesStatus, InvesStatusType, OrderRecord } from 'utils/fetch/product'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useDualInvestCallback } from 'hooks/useDualInvest'

enum ErrorType {
  insufficientBalance = 'Insufficient Balance',
  singleLimitExceed = 'Single Limit Exceeded'
}

export default function SubscribeForm({
  product,
  setAmount,
  amount,
  id
}: {
  amount: string
  product?: Product
  setAmount: (val: string) => void
  id: string
}) {
  const theme = useTheme()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [currentCurrency, setCurrentCurrency] = useState(BTC)
  const [pending, setPending] = useState(false)
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const multiplier = product ? (product.type === 'CALL' ? 1 : +product.strikePrice) : 1

  const balance = useDualInvestBalance(currentCurrency)
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  const addPopup = useAddPopup()
  const addTransaction = useTransactionAdder()
  const { createOrderCallback, checkOrderStatusCallback } = useDualInvestCallback()

  const handleChange = useCallback(
    e => {
      setAmount(e.target.value ? Math.floor(+e.target.value) + '' : '')
    },
    [setAmount]
  )

  const showConfirm = useCallback(() => {
    setIsConfirmOpen(true)
  }, [])
  const hideConfirm = useCallback(() => {
    setIsConfirmOpen(false)
  }, [])

  const showDeposit = useCallback(() => {
    setIsDepositOpen(true)
  }, [])

  const hideDeposit = useCallback(() => {
    setIsDepositOpen(false)
  }, [])

  const data = useMemo(
    () => ({
      ['Spot Price']: product?.currentPrice ?? '-' + ' USDT',
      ['APY']: product?.apy ? (+product.apy * 100).toFixed(2) + '%' : '- %',
      ['Strike Price']: product?.strikePrice || '-' + ' USDT',
      ['Delivery Date']: product ? dayjs(product.expiredAt).format('DD MMM YYYY') : '-'
    }),
    [product]
  )
  const error = useMemo(() => {
    if (!product || !balance) return ''
    let str = ''
    if (amount !== '' && +balance < +amount * +product.multiplier * multiplier) str = ErrorType.insufficientBalance
    if (amount !== '' && (+amount > +product?.orderLimit || +amount < 1)) str = ErrorType.singleLimitExceed
    return str
  }, [amount, balance, multiplier, product])

  const handleSubscribe = useCallback(async () => {
    if (!product || !amount || !createOrderCallback || !checkOrderStatusCallback) return
    const val = tryParseAmount(
      (+amount * +product?.multiplier * multiplier).toFixed(2),
      currentCurrency
    )?.raw?.toString()
    if (!val) return
    try {
      setPending(true)
      showModal(<TransacitonPendingModal />)
      const backendCall = await Axios.post<any>(
        'createOrder',
        {},
        {
          account,
          amount,
          product_id: id
        }
      )
      if (backendCall.data.code !== 200) throw Error('Backend Error')
      if (!backendCall.data.data) throw Error(backendCall.data.msg)
      const { orderId, productId } = backendCall.data.data
      const orderStatusRes = await checkOrderStatusCallback(orderId)
      if (orderStatusRes.status !== 0) {
        throw Error('Order Exist')
      }

      const createOrderRes = await createOrderCallback(orderId, productId, val, currentCurrency.address)
      addTransaction(createOrderRes, {
        createOrder: true,
        summary: ''
      })
      hideModal()
      setPending(false)
      setIsConfirmed(false)
      setAmount('')
      showModal(<TransactionSubmittedModal />)
      let fail = 0
      const polling = new Promise((resolve, reject) => {
        const timeoutId = setInterval(() => {
          Axios.get<{ records: OrderRecord[] }>('getOrderRecord?orderId=' + orderId, { address: account })
            .then(r => {
              const statusCode = r.data.data.records[0].investStatus as keyof typeof InvesStatus
              if (InvesStatus[statusCode] === InvesStatusType.ERROR) {
                clearInterval(timeoutId)
                reject('Subscription fail')
                throw Error('Subscription failed, please try again later')
              }
              if (InvesStatus[statusCode] === InvesStatusType.SUCCESS) {
                clearInterval(timeoutId)
                resolve(() => {})

                // showModal(
                //   <TransactionSubmittedModal header={'Successful Subscription!'}>
                //     <Typography fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
                //       {`You have successfully subscribed ${+product?.multiplier * +amount * multiplier} ${
                //         product?.currency
                //       } to ${product.investCurrency}[${type === 'CALL' ? 'upward' : 'drop'} exercise] ${
                //         product.strikePrice
                //       } ${dayjs(product.expiredAt).format()}`}
                //     </Typography>
                //   </TransactionSubmittedModal>
                // )
              }
            })
            .catch(() => {
              if (fail > 6) {
                clearInterval(timeoutId)
                reject('Confirm Order timeout')
                throw Error('Confirm Order timeout')
              }
              fail++
            })
        }, 3000)
      })
      await polling

      addPopup(
        {
          txn: {
            success: true,
            summary: `Subscribed ${(+amount * +product?.multiplier * multiplier).toFixed(2)} ${
              product.investCurrency
            } successfully to ${product?.currency} [${
              product?.type === 'CALL' ? 'upward' : 'drop'
            }], order ID:${orderId}`
          }
        },
        orderId + ''
      )

      setIsConfirmed(false)
    } catch (e) {
      setPending(false)
      setIsConfirmed(false)
      setAmount('')
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [
    account,
    addPopup,
    addTransaction,
    amount,
    checkOrderStatusCallback,
    createOrderCallback,
    currentCurrency,
    hideModal,
    id,
    multiplier,
    product,
    setAmount,
    showModal
  ])

  const handleConfirm = useCallback(() => {
    setIsConfirmed(true)
    setIsConfirmOpen(false)
    handleSubscribe()
  }, [handleSubscribe])

  useEffect(() => {
    product?.type === 'CALL' ? setCurrentCurrency(BTC) : setCurrentCurrency(USDT)
  }, [product?.type])

  return (
    <>
      <ConfirmModal isOpen={isConfirmOpen} onDismiss={hideConfirm} onConfirm={handleConfirm} amount={amount} />
      <ActionModal isOpen={isDepositOpen} onDismiss={hideDeposit} token={currentCurrency} type={ActionType.DEPOSIT} />
      <Box display="grid" flexDirection="column" gap={16} height="100%" width="100%" padding="36px 24px">
        {Object.keys(data).map((key, idx) => (
          <Box key={idx} display="flex" justifyContent="space-between">
            <Typography fontSize={16} sx={{ opacity: 0.8 }}>
              {key}
            </Typography>
            {/* {key === 'Current Progress' ? (
      <SimpleProgress key={1} val={0.16} total={1} />
    ) : ( */}
            <Typography color={key === 'APY' ? theme.palette.primary.main : theme.palette.text.primary}>
              {data[key as keyof typeof data]}
            </Typography>
            {/* )} */}
          </Box>
        ))}
        <Divider extension={24} sx={{ opacity: 0.1 }} />

        <InputNumerical
          placeholder="0.00"
          disabled={!product || !account || isConfirmed}
          value={amount}
          onMax={() => {
            if (!product) return
            const maxAvailable = balance
              ? Math.floor(+balance / ((product ? +product?.multiplier : 1) * multiplier))
              : 0
            setAmount(`${maxAvailable > +product?.orderLimit ? product.orderLimit : maxAvailable}`)
          }}
          label={'Subscription Amount'}
          onChange={handleChange}
          error={!!error}
        />
        <Box>
          <Box display="flex" justifyContent="space-between">
            <InputLabel>Investment Amount</InputLabel>
            <Box display="flex" alignItems="baseline">
              {!!balance && (
                <InputLabel style={{ fontSize: '12px' }}>
                  Available: {balance || '-'} {product ? product.investCurrency : ''}
                </InputLabel>
              )}

              <TextButton fontSize={12} color="#11BF2D" style={{ marginLeft: 8 }} onClick={showDeposit}>
                Deposit
              </TextButton>
            </Box>
          </Box>
          <OutlinedCard>
            <Box height="60px" display="flex" alignItems="center" padding="16px" justifyContent="space-between">
              {product && (
                <>
                  <Typography component="span" color="primary" fontSize={16}>
                    {(+product.multiplier * +amount * multiplier).toFixed(2)} {product.investCurrency}
                  </Typography>
                  <Typography component="span" fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
                    ={+amount}*{product.multiplier} {product.currency}
                    {product?.type !== 'CALL' ? `*${product.strikePrice}` : ''}
                  </Typography>
                </>
              )}
            </Box>
          </OutlinedCard>
          <Box display="flex" mt={12} justifyContent="space-between">
            <Typography fontSize={12} sx={{ opacity: 0.5 }}>
              <span>Min: {product ? +product.multiplier * multiplier + ' ' + product.investCurrency : '-'}</span>
            </Typography>
            <Typography fontSize={12} sx={{ opacity: 0.5 }}>
              <span>
                Max:{' '}
                {product ? +product.orderLimit * +product.multiplier * multiplier + ' ' + product.investCurrency : '-'}
              </span>
            </Typography>
          </Box>
        </Box>
        {!account && <BlackButton onClick={toggleWallet}>Connect Wallet</BlackButton>}
        {!isConfirmed && account && (
          <ActionButton
            pending={pending}
            pendingText={'Pending'}
            error={!amount ? 'Please Input Amount' : ''}
            onAction={showConfirm}
            actionText=" Subscribe"
            disableAction={!product?.isActive ? true : !!error}
            successText={'Ended'}
            success={!product?.isActive}
          />
        )}
        {isConfirmed && account && (
          <ActionButton
            pending={pending}
            pendingText={'Pending'}
            error={!amount ? 'Please Input Amount' : ''}
            onAction={handleSubscribe}
            actionText=" Subscribe"
            disableAction={!product?.isActive ? true : !!error}
            successText={'Ended'}
            success={!product?.isActive}
          />
        )}
        <Box display="flex">
          <InfoOutlinedIcon sx={{ color: error ? theme.palette.error.main : theme.palette.primary.main, height: 12 }} />
          <Typography component="p" fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
            {error ? (
              error === ErrorType.insufficientBalance ? (
                <>
                  <Typography component="span" color="error" fontSize={12}>
                    Insufficient Balance.
                  </Typography>
                  Please recharge your account first before opening wealth management
                </>
              ) : (
                <>
                  <Typography component="span" color="error" fontSize={12} sx={{ display: 'block' }}>
                    Single Limit Exceeded.
                  </Typography>
                  Single financial management limit is {product?.multiplier ?? '-'}～
                  {product ? +product?.orderLimit * +product?.multiplier : '-'} BTC
                </>
              )
            ) : (
              <>Once subscribed the APY will get locked in, the product can&apos;t be cancelled after subscription.</>
            )}
          </Typography>
        </Box>
      </Box>
    </>
  )
}
