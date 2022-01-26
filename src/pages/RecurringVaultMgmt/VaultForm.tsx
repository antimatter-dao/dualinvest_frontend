import { useState, useCallback, useMemo } from 'react'
import { Box, Alert } from '@mui/material'
import VaultCard from 'components/MgmtPage/VaultCard'
import VaultFormComponent from 'components/MgmtPage/VaultForm'
import { useActiveWeb3React } from 'hooks'
import { useDualInvestBalance } from 'hooks/useDualInvest'
import { CURRENCIES } from 'constants/currencies'
import { RecurProduct } from 'utils/fetch/recur'
import { useRecurBalance, useRecurCallback } from 'hooks/useRecur'
import { useRecurPnl } from 'hooks/useRecurData'
import { tryParseAmount } from 'utils/parseAmount'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function VaultForm({ product }: { product: RecurProduct | undefined }) {
  const currencySymbol = product?.investCurrency ?? ''

  const [snackbarOpen, setSnackbarOpen] = useState(true)
  const [isRecurOpen, setIsRecurOpen] = useState(false)
  const [investAmount, setInvestAmount] = useState('')
  const { redeemCallback, investCallback } = useRecurCallback()

  const pnl = useRecurPnl(currencySymbol)
  const { autoLockedBalance, autoBalance, autoBalanceRaw } = useRecurBalance(
    currencySymbol ? CURRENCIES[currencySymbol] : undefined
  )
  const { account } = useActiveWeb3React()
  const contractBalance = useDualInvestBalance(CURRENCIES[currencySymbol] ?? undefined)
  const { showModal, hideModal } = useModal()
  const addPopup = useTransactionAdder()

  const formData = useMemo(
    () => ({
      ['Current cycle invested amount:']: autoLockedBalance + currencySymbol,
      ['Redeemable:']: autoBalance + currencySymbol,
      ['P&L:']: pnl + currencySymbol
    }),
    [autoLockedBalance, currencySymbol, autoBalance, pnl]
  )

  const handleCloseSnakebar = useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  const handleInvestChange = useCallback(val => {
    setInvestAmount(val)
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
      hideModal()
    } catch (e) {
      setInvestAmount('')
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [addPopup, currencySymbol, hideModal, investAmount, investCallback, product, showModal])

  const handleWithdraw = useCallback(async () => {
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
    } catch (e) {
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [currencySymbol, redeemCallback, product, showModal, autoBalanceRaw, addPopup, autoBalance, hideModal])

  return (
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
          warning: The primary risk for running this covered call strategy is that the vault may incur a weekly loss in
          the case where the call option sold by the vault expires in-the-money
        </Alert>
      )}

      <VaultCard
        account={account}
        title={
          product?.type === 'CALL'
            ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
            : `${product?.currency ?? ''} Put Selling Recuring Strategy`
        }
        description={`Generates yield by running an automated ${
          product?.type === 'CALL' ? `${product?.currency ?? ''} covered call strategy` : `put selling strategy`
        }`}
        logoCurSymbol={currencySymbol}
        priceCurSymbol={product?.currency ?? ''}
        timer={product?.expiredAt ?? 0}
        isRecurOpen={isRecurOpen}
        onRecurOpen={() => {
          setIsRecurOpen(prev => !prev)
        }}
        activeOrder={5}
        vaultForm={
          <VaultFormComponent
            redeemDisabled={!product}
            investDisabled={!product}
            onWithdraw={handleWithdraw}
            onInvest={handleInvest}
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
  )
}
