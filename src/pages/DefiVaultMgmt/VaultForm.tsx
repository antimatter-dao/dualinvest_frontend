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
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import RedeemConfirmModal from './RedeemConfirmModal'
import InvestConfirmModal from './InvestConfirmModal'
import { feeRate, getDefiVaultAddress } from 'constants/index'
import { NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'
import { useETHBalances, useTokenBalance } from 'state/wallet/hooks'
import { DefiProduct } from 'hooks/useDefiVault'
import { useDefiVaultCallback } from 'hooks/useDefiVaultCallback'
import { CURRENCIES, DEFAULT_COIN_SYMBOL } from 'constants/currencies'
import { Timer } from 'components/Timer'
import { useApproveCallback, ApprovalState } from 'hooks/useApproveCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'

export default function VaultForm({
  product,
  amount,
  setAmount
}: {
  product: DefiProduct | undefined
  amount: string
  setAmount: (val: string) => void
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
  const [wdConfirmOpen, setWdConfirmOpen] = useState(false)
  const [investConfirmOpen, setInvestConfirmOpen] = useState(false)

  const balance =
    product?.investCurrency === SUPPORTED_NETWORKS[chainId ?? NETWORK_CHAIN_ID].nativeCurrency.symbol
      ? ETHBalance
        ? maxAmountSpend(ETHBalance)?.toExact()
        : '-'
      : tokenBalance?.toExact()

  const {
    depositCallback,
    instantWithdrawCallback,
    standardWithdrawCallback,
    standardCompleteCallback
  } = useDefiVaultCallback(product?.chainId, product?.currency, product?.type)

  const { showModal, hideModal } = useModal()
  const addPopup = useTransactionAdder()
  const [approvalState, approveCallback] = useApproveCallback(
    tryParseAmount(amount, investCurrency),
    getDefiVaultAddress(product?.currency, product?.chainId, product?.type)
  )

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
      setAmount(val)
    },
    [setAmount]
  )

  const handleInvestConfirmOpen = useCallback(() => {
    setInvestConfirmOpen(true)
  }, [])
  const handleInvestConfirmDismiss = useCallback(() => {
    setInvestConfirmOpen(false)
  }, [])
  const handleWdConfirmOpen = useCallback(() => {
    setWdConfirmOpen(true)
  }, [])
  const handleWdConfirmDismiss = useCallback(() => {
    setWdConfirmOpen(false)
  }, [])

  const callbackFactory = useCallback(
    (summary: string, callback: (...args: any[]) => Promise<any>) => {
      return async (amount: string) => {
        showModal(<TransactionPendingModal />)
        const val = tryParseAmount(amount, investCurrency)?.raw?.toString()
        if (!val) return
        try {
          const r = await callback(val)
          hideModal()

          addPopup(r, {
            summary
          })
          setAmount('')
          showModal(<TransactionSubmittedModal />)
        } catch (e) {
          setAmount('')
          showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
          console.error(e)
        }
      }
    },
    [addPopup, hideModal, investCurrency, setAmount, showModal]
  )

  const handleInvest = useMemo(() => {
    if (!currency || !depositCallback || !product || !investCurrency) return () => {}
    return callbackFactory(
      `Subscribed ${amount} ${product.investCurrency} to ${
        product.type === 'CALL'
          ? `${product?.currency ?? ''} Covered Call Defi Vault`
          : `${product?.currency ?? ''} Put Selling Defi Vault`
      }`,
      depositCallback
    )
  }, [currency, depositCallback, product, investCurrency, callbackFactory, amount])

  const handleInstantWd = useMemo(() => {
    if (!investCurrency || !instantWithdrawCallback || !product || !currency) return () => {}
    return callbackFactory(
      `Instantly withdrawed ${amount} ${product.investCurrency} from ${
        product.type === 'CALL'
          ? `${product?.currency ?? ''} Covered Call Defi Vault`
          : `${product?.currency ?? ''} Put Selling Defi Vault`
      }`,
      instantWithdrawCallback
    )
  }, [investCurrency, instantWithdrawCallback, product, currency, callbackFactory, amount])

  const handleStandardWd = useCallback(
    (amount: string, initiated: boolean) => {
      showModal(
        <RedeemConfirmModal
          isOpen={true}
          onDismiss={hideModal}
          onConfirm={() => {
            if (!investCurrency || !standardWithdrawCallback || !product || !currency) {
              return
            }

            callbackFactory(
              `Withdrawed ${amount} ${product.investCurrency} from ${
                product.type === 'CALL'
                  ? `${product?.currency ?? ''} Covered Call Defi Vault`
                  : `${product?.currency ?? ''} Put Selling Defi Vault`
              }`,
              initiated ? standardCompleteCallback : standardWithdrawCallback
            )(amount)
          }}
          amount={amount}
          currency={investCurrency}
        />
      )
    },
    [
      callbackFactory,
      currency,
      hideModal,
      investCurrency,
      product,
      showModal,
      standardCompleteCallback,
      standardWithdrawCallback
    ]
  )

  return (
    <>
      <InvestConfirmModal
        isNativeCur={DEFAULT_COIN_SYMBOL[chainId ?? NETWORK_CHAIN_ID] === investCurrency.symbol}
        approvalState={approvalState}
        currency={investCurrency}
        productTitle={title}
        amount={(+amount).toFixed(2)}
        confirmData={confirmData}
        isOpen={investConfirmOpen}
        onDismiss={handleInvestConfirmDismiss}
        onConfirm={
          DEFAULT_COIN_SYMBOL[product?.chainId ?? NETWORK_CHAIN_ID] === investCurrency?.symbol ||
          approvalState === ApprovalState.APPROVED
            ? () => {
                handleInvest(amount)
                setInvestConfirmOpen(false)
              }
            : approveCallback
        }
      />
      <RedeemConfirmModal
        isOpen={wdConfirmOpen}
        onDismiss={handleWdConfirmDismiss}
        onConfirm={() => {
          handleInstantWd(amount)
          setWdConfirmOpen(false)
        }}
        amount={amount}
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
          walletBalance={balance}
          title={title}
          formData={formData}
          product={product}
          onStandardWd={handleStandardWd}
          onInstantWd={handleWdConfirmOpen}
          onInvest={handleInvestConfirmOpen}
          available={balance}
          onInvestChange={handleInvestChange}
          amount={amount}
        />
      </Box>
    </>
  )
}
