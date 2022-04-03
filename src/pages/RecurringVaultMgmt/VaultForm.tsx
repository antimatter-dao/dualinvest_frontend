import { useState, useCallback, useMemo } from 'react'
import { Box, Alert, Typography } from '@mui/material'
import dayjs from 'dayjs'
import VaultCard from 'components/MgmtPage/RecurCard'
import VaultFormComponent from 'components/MgmtPage/RecurForm'
import { useActiveWeb3React } from 'hooks'
import { useDualInvestBalance } from 'hooks/useDualInvest'
import { CURRENCIES } from 'constants/currencies'
import { RecurProduct } from 'utils/fetch/recur'
import { useRecurBalance, useRecurCallback } from 'hooks/useRecur'
import { RECUR_TOGGLE_STATUS, useRecurActiveOrderCount, useRecurPnl, useRecurToggle } from 'hooks/useRecurData'
import { tryParseAmount } from 'utils/parseAmount'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTransactionAdder } from 'state/transactions/hooks'
import RecurConfirmModal from '../RecurringVaultMgmt/RecurConfirmModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import RedeemConfirmModal from './RedeemConfirmModal'
import InvestConfirmModal from './InvestConfirmModal'
import { feeRate } from 'constants/index'
import { NETWORK_CHAIN_ID } from 'constants/chain'

export enum ErrorType {
  insufficientBalance = 'Insufficient Balance',
  notAvailable = 'The current status is not available for subscription, please try again after the current period is settled'
}

export default function VaultForm({
  product,
  investAmount,
  setInvestAmount
}: {
  product: RecurProduct | undefined
  investAmount: string
  setInvestAmount: (val: string) => void
}) {
  const { account } = useActiveWeb3React()
  const currencySymbol = product?.investCurrency ?? ''
  const investCurrency = CURRENCIES[NETWORK_CHAIN_ID][currencySymbol] ?? undefined
  const currency = CURRENCIES[NETWORK_CHAIN_ID][product?.currency ?? ''] ?? undefined
  const title =
    product?.type === 'CALL'
      ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
      : `${product?.currency ?? ''} Put Selling Recurring Strategy`

  const [snackbarOpen, setSnackbarOpen] = useState(true)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [redeemConfirmOpen, setRedeemConfirmOpen] = useState(false)
  const [investConfirmOpen, setInvestConfirmOpen] = useState(false)

  const { redeemCallback, investCallback } = useRecurCallback()
  const { pnl } = useRecurPnl(currencySymbol)
  const { autoLockedBalance, autoBalance, autoBalanceRaw } = useRecurBalance(currency, investCurrency)
  const { recurStatus, toggleRecur } = useRecurToggle(investCurrency?.address, currency?.address)
  const contractBalance = useDualInvestBalance(investCurrency)
  const { showModal, hideModal } = useModal()
  const addPopup = useTransactionAdder()
  const activeOrderCount = useRecurActiveOrderCount(currency?.symbol, investCurrency?.symbol, autoLockedBalance)

  const formData = useMemo(
    () => ({
      ['Current cycle invested amount:']: autoLockedBalance + ' ' + currencySymbol,
      ['Redeemable:']: autoBalance + ' ' + currencySymbol,
      ['P&L:']: pnl + ' ' + currencySymbol
    }),
    [autoLockedBalance, currencySymbol, autoBalance, pnl]
  )

  const confirmData = useMemo(
    () => ({
      ['Platform service fee']: feeRate,
      ['Spot Price']: product?.indexPrice ?? '-' + ' USDT',
      ['APY']: product?.apy ?? '-',
      ['Strike Price']: product?.strikePrice ?? '-' + ' USDT',
      ['Delivery Date']: product ? dayjs(product.expiredAt).format('DD MMM YYYY') + ' 08:30:00 AM UTC' : '-'
    }),
    [product]
  )

  const handleCloseSnakebar = useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  const handleInvestChange = useCallback(
    val => {
      setInvestAmount(val)
    },
    [setInvestAmount]
  )

  const handleInvestConfirmOpen = useCallback(() => {
    setInvestConfirmOpen(true)
  }, [])
  const handleInvestConfirmDismiss = useCallback(() => {
    setInvestConfirmOpen(false)
  }, [])
  const handleRedeemConfirmOpen = useCallback(() => {
    setRedeemConfirmOpen(true)
  }, [])
  const handleRedeemConfirmDismiss = useCallback(() => {
    setRedeemConfirmOpen(false)
  }, [])

  const handleInvest = useCallback(async () => {
    if (!currency || !investCallback || !product || !investCurrency) return
    showModal(<TransactionPendingModal />)
    const val = tryParseAmount(
      (
        +investAmount * (product ? product.multiplier * (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
      ).toFixed(2),
      investCurrency
    )?.raw?.toString()
    if (!val) return
    try {
      const r = await investCallback(val, currency.address, investCurrency.address)
      hideModal()

      toggleRecur(RECUR_TOGGLE_STATUS.open)

      addPopup(r, {
        summary: `Subscribed ${(
          +investAmount * (product ? product.multiplier * (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
        ).toFixed(2)} ${product.investCurrency} to ${
          product.type === 'CALL'
            ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
            : `${product?.currency ?? ''} Put Selling Recurring Strategy`
        }`
      })
      setInvestAmount('')
      showModal(<TransactionSubmittedModal />)
    } catch (e) {
      setInvestAmount('')
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [
    currency,
    investCallback,
    product,
    investCurrency,
    showModal,
    investAmount,
    hideModal,
    toggleRecur,

    addPopup,
    setInvestAmount
  ])

  const handleRedeem = useCallback(async () => {
    if (!investCurrency || !redeemCallback || !product || !currency) return
    showModal(<TransactionPendingModal />)

    try {
      const r = await redeemCallback(autoBalanceRaw, currency.address, investCurrency.address)
      addPopup(r, {
        summary: `Redeemed ${autoBalance} ${product.investCurrency} from ${
          product.type === 'CALL'
            ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
            : `${product?.currency ?? ''} Put Selling Recurring Strategy`
        }`
      })
      hideModal()
      showModal(<TransactionSubmittedModal />)
    } catch (e) {
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [investCurrency, redeemCallback, product, currency, showModal, autoBalanceRaw, addPopup, autoBalance, hideModal])

  const error = useMemo(() => {
    if (!product || !contractBalance) return ''
    let str = ''

    if (
      investAmount !== '' &&
      +contractBalance < +investAmount * +product.multiplier * (product.type === 'CALL' ? 1 : +product.strikePrice)
    ) {
      str = ErrorType.insufficientBalance
    }

    const now = Date.now()
    const before = product.expiredAt - 7200000
    const after = product.expiredAt + 1800000

    if (product.price === null || (now >= before && now < after)) {
      str = ErrorType.notAvailable
    }

    return str
  }, [contractBalance, investAmount, product])

  return (
    <>
      <RecurConfirmModal
        isOpen={isConfirmOpen}
        onDismiss={() => setIsConfirmOpen(false)}
        type={recurStatus !== RECUR_TOGGLE_STATUS.open ? 'on' : 'off'}
        onConfirm={() => {
          toggleRecur(recurStatus === RECUR_TOGGLE_STATUS.open ? RECUR_TOGGLE_STATUS.close : RECUR_TOGGLE_STATUS.open)
          setIsConfirmOpen(false)
        }}
      />
      <InvestConfirmModal
        currency={investCurrency}
        productTitle={title}
        amount={(
          +investAmount * (product ? product.multiplier * (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
        ).toFixed(2)}
        confirmData={confirmData}
        isOpen={investConfirmOpen}
        onDismiss={handleInvestConfirmDismiss}
        onConfirm={() => {
          handleInvest()
          setInvestConfirmOpen(false)
        }}
      />
      <RedeemConfirmModal
        isOpen={redeemConfirmOpen}
        onDismiss={handleRedeemConfirmDismiss}
        onConfirm={() => {
          handleRedeem()
          setRedeemConfirmOpen(false)
        }}
        amount={autoBalance}
        currency={investCurrency}
      />
      <Box display="grid" position="relative" gap="35px" mt={24}>
        {snackbarOpen && (
          <Alert
            onClose={handleCloseSnakebar}
            severity="error"
            sx={{
              width: '100%',
              color: theme => theme.palette.error.main,
              background: theme => theme.palette.background.paper,
              border: theme => `1px solid ${theme.palette.error.main}`,
              '& .MuiAlert-icon': {
                color: theme => theme.palette.error.main
              },
              fontSize: 16
            }}
          >
            <div style={{ maxWidth: 963, lineHeight: '19.2px', margin: '-4px 0' }}>
              Warning:{' '}
              <Typography component="span" sx={{ color: theme => theme.palette.text.primary }}>
                The primary risk for running this covered call strategy is that the vault may incur a weekly loss in the
                case where the call option sold by the vault expires in-the-money
              </Typography>
            </div>
          </Alert>
        )}

        <VaultCard
          account={account}
          title={title}
          description={`Generates yield by running an automated ${
            product?.type === 'CALL' ? `${product?.currency ?? ''} covered call strategy` : `put selling strategy`
          }`}
          logoCurSymbol={currencySymbol}
          priceCurSymbol={product?.currency ?? ''}
          timer={product?.expiredAt ?? 0}
          recurStatus={recurStatus}
          onRecurOpen={() => {
            setIsConfirmOpen(true)
          }}
          activeOrder={activeOrderCount}
          vaultForm={
            <VaultFormComponent
              error={error}
              redeemDisabled={!product || !+autoBalance}
              investDisabled={!product || !investAmount}
              onWithdraw={handleRedeemConfirmOpen}
              onInvest={handleInvestConfirmOpen}
              formData={formData}
              currencySymbol={currencySymbol}
              available={contractBalance}
              apy={product?.apy ?? ''}
              onInvestChange={handleInvestChange}
              investAmount={investAmount}
              multiplier={product ? product.multiplier * (product.type === 'CALL' ? 1 : +product.strikePrice) : 1}
              formula={`${product?.multiplier ?? '-'} ${product?.currency ?? '-'}
            ${product?.type === 'CALL' ? '' : `*${product?.strikePrice ?? '-'}`}`}
            />
          }
        />
      </Box>
    </>
  )
}
