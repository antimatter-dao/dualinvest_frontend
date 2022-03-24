import { useState, useCallback, useMemo } from 'react'
import { Box, Alert, Typography } from '@mui/material'
import dayjs from 'dayjs'
import VaultCard from 'components/MgmtPage/VaultCard'
import { useActiveWeb3React } from 'hooks'
import { tryParseAmount } from 'utils/parseAmount'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTransactionAdder } from 'state/transactions/hooks'
import RecurConfirmModal from './RecurConfirmModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import RedeemConfirmModal from './RedeemConfirmModal'
import InvestConfirmModal from './InvestConfirmModal'
import { feeRate } from 'constants/index'
import { NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'
import { useETHBalances, useTokenBalance } from 'state/wallet/hooks'
import { DefiProduct } from 'hooks/useDefiVault'
import { useDefiVaultCallback } from 'hooks/useDefiVaultCallback'
import { CURRENCIES } from 'constants/currencies'
import { Timer } from 'components/Timer'

export enum ErrorType {
  insufficientBalance = 'Insufficient Balance',
  notAvailable = 'The current status is not available for subscription, please try again after the current period is settled'
}

export default function VaultForm({
  product,
  investAmount,
  setInvestAmount
}: {
  product: DefiProduct | undefined
  investAmount: string
  setInvestAmount: (val: string) => void
}) {
  const { account, chainId } = useActiveWeb3React()
  const currencySymbol = product?.investCurrency ?? ''
  const investCurrency = CURRENCIES[product?.chainId ?? NETWORK_CHAIN_ID][product?.investCurrency ?? '']
  const currency = CURRENCIES[product?.chainId ?? NETWORK_CHAIN_ID][product?.currency ?? '']
  const title =
    product?.type === 'CALL'
      ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
      : `${product?.currency ?? ''} Put Selling Recurring Strategy`

  const ETHBalance = useETHBalances([account ?? undefined])?.[account ?? '']
  const tokenBalance = useTokenBalance(account ?? undefined, investCurrency)
  const [snackbarOpen, setSnackbarOpen] = useState(true)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [redeemConfirmOpen, setRedeemConfirmOpen] = useState(false)
  const [investConfirmOpen, setInvestConfirmOpen] = useState(false)

  const balance =
    product?.investCurrency === SUPPORTED_NETWORKS[chainId ?? NETWORK_CHAIN_ID].nativeCurrency.symbol
      ? ETHBalance?.toExact()
      : tokenBalance?.toExact()

  const { depositCallback, withdrawCallback } = useDefiVaultCallback(product?.chainId, product?.currency, product?.type)
  const { showModal, hideModal } = useModal()
  const addPopup = useTransactionAdder()

  const autoBalance = '0'

  const formData = useMemo(
    () => ({
      ['P&L:']: '-' + ' ' + currencySymbol,
      ['Current cycle invested amount:']: '-' + ' ' + currencySymbol,
      ['Progress order due time:']: <Timer timer={product?.expiredAt ?? 0} />
    }),
    [currencySymbol, product?.expiredAt]
  )

  const confirmData = useMemo(
    () => ({
      ['Platform service fee']: feeRate,
      ['Spot Price']: '000' ?? '-' + ' USDT',
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
    if (!currency || !depositCallback || !product || !investCurrency) return
    showModal(<TransactionPendingModal />)
    const val = tryParseAmount(investAmount, investCurrency)?.raw?.toString()
    if (!val) return
    try {
      const r = await depositCallback(val)
      hideModal()

      addPopup(r, {
        summary: `Subscribed ${investAmount} ${product.investCurrency} to ${
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
    depositCallback,
    product,
    investCurrency,
    showModal,
    investAmount,
    hideModal,
    addPopup,
    setInvestAmount
  ])

  const handleRedeem = useCallback(async () => {
    if (!investCurrency || !withdrawCallback || !product || !currency) return
    showModal(<TransactionPendingModal />)

    try {
      const r = await withdrawCallback()
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
  }, [investCurrency, withdrawCallback, product, currency, showModal, addPopup, hideModal])

  const error = useMemo(() => {
    if (!product || !balance) return ''
    let str = ''

    if (investAmount !== '' && +balance < +investAmount) {
      str = ErrorType.insufficientBalance
    }

    const now = Date.now()
    const before = product.expiredAt - 7200000
    const after = product.expiredAt + 1800000

    if (now >= before && now < after) {
      str = ErrorType.notAvailable
    }

    return str
  }, [balance, investAmount, product])

  return (
    <>
      <RecurConfirmModal
        isOpen={isConfirmOpen}
        onDismiss={() => setIsConfirmOpen(false)}
        type={'on'}
        onConfirm={() => {
          setIsConfirmOpen(false)
        }}
      />
      <InvestConfirmModal
        currency={investCurrency}
        productTitle={title}
        amount={(+investAmount).toFixed(2)}
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

      <Box display="grid" position="relative" gap="35px" mt={32}>
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
          title={title}
          formData={formData}
          error={error}
          product={product}
          onWithdraw={handleRedeemConfirmOpen}
          onInvest={handleInvestConfirmOpen}
          available={balance}
          onInvestChange={handleInvestChange}
          investAmount={investAmount}
        />
      </Box>
    </>
  )
}
