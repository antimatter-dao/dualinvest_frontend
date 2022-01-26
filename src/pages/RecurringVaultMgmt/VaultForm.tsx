import { useState, useCallback, useMemo } from 'react'
import { Box, Alert } from '@mui/material'
import VaultCard from 'components/MgmtPage/VaultCard'
import VaultFormComponent from 'components/MgmtPage/VaultForm'
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
import dayjs from 'dayjs'

export default function VaultForm({
  product,
  investAmount,
  setInvestAmount
}: {
  product: RecurProduct | undefined
  investAmount: string
  setInvestAmount: (val: string) => void
}) {
  const currencySymbol = product?.investCurrency ?? ''
  const currency = CURRENCIES[currencySymbol] ?? undefined
  const title =
    product?.type === 'CALL'
      ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
      : `${product?.currency ?? ''} Put Selling Recuring Strategy`

  const [snackbarOpen, setSnackbarOpen] = useState(true)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [redeemConfirmOpen, setRedeemConfirmOpen] = useState(false)
  const [investConfirmOpen, setInvestConfirmOpen] = useState(false)

  const { redeemCallback, investCallback } = useRecurCallback()
  const { pnl } = useRecurPnl(currencySymbol)
  const { autoLockedBalance, autoBalance, autoBalanceRaw } = useRecurBalance(currency)
  const { recurStatus, toggleRecur } = useRecurToggle(product ? currency?.address : undefined)
  const { account } = useActiveWeb3React()
  const contractBalance = useDualInvestBalance(currency)
  const { showModal, hideModal } = useModal()
  const addPopup = useTransactionAdder()
  const activeOrderCount = useRecurActiveOrderCount(currency?.symbol)

  const formData = useMemo(
    () => ({
      ['Current cycle invested amount:']: autoLockedBalance + currencySymbol,
      ['Redeemable:']: autoBalance + currencySymbol,
      ['P&L:']: pnl + currencySymbol
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
    const cur = CURRENCIES[currencySymbol]
    if (!cur || !investCallback || !product) return
    showModal(<TransactionPendingModal />)
    const val = tryParseAmount(
      (
        +investAmount * (product ? product.multiplier * (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
      ).toFixed(2),
      cur
    )?.raw?.toString()
    if (!val) return
    try {
      const r = await investCallback(val, cur.address)
      hideModal()

      addPopup(r, {
        summary: `Subscribed ${(
          +investAmount * (product ? product.multiplier * (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
        ).toFixed(2)} ${product.investCurrency} to ${
          product.type === 'CALL'
            ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
            : `${product?.currency ?? ''} Put Selling Recuring Strategy`
        }`
      })
      setInvestAmount('')
      showModal(<TransactionSubmittedModal />)
    } catch (e) {
      setInvestAmount('')
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [addPopup, currencySymbol, hideModal, investAmount, investCallback, product, setInvestAmount, showModal])

  const handleRedeem = useCallback(async () => {
    const cur = CURRENCIES[currencySymbol]
    if (!cur || !redeemCallback || !product) return
    showModal(<TransactionPendingModal />)

    try {
      const r = await redeemCallback(autoBalanceRaw, cur.address)
      addPopup(r, {
        summary: `Redeemed ${autoBalance} ${product.investCurrency} from ${
          product.type === 'CALL'
            ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
            : `${product?.currency ?? ''} Put Selling Recuring Strategy`
        }`
      })
      hideModal()
      showModal(<TransactionSubmittedModal />)
    } catch (e) {
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [currencySymbol, redeemCallback, product, showModal, autoBalanceRaw, addPopup, autoBalance, hideModal])

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
        currency={currency}
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
        currency={currency}
      />
      <Box display="grid" position="relative" gap="35px" mt={-24}>
        {snackbarOpen && (
          <Alert
            onClose={handleCloseSnakebar}
            severity="error"
            sx={{
              width: '100%',
              color: theme => theme.palette.error.main,
              background: theme => theme.palette.error.light,
              border: theme => `1px solid ${theme.palette.error.main}`,
              '& .MuiAlert-icon': {
                color: theme => theme.palette.error.main
              },
              fontSize: 12
            }}
          >
            warning: The primary risk for running this covered call strategy is that the vault may incur a weekly loss
            in the case where the call option sold by the vault expires in-the-money
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
          isRecurOpen={recurStatus === RECUR_TOGGLE_STATUS.open}
          onRecurOpen={() => {
            setIsConfirmOpen(true)
          }}
          activeOrder={activeOrderCount}
          vaultForm={
            <VaultFormComponent
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
