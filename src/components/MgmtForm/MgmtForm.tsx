import React, { ChangeEvent, useState, useCallback } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import Divider from 'components/Divider'
import InputNumerical from 'components/Input/InputNumerical'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ActionButton from 'components/Button/ActionButton'
import { BlackButton } from 'components/Button/Button'
import ActionModal, { ActionType } from 'pages/Account/modals/ActionModal'
import { useWalletModalToggle } from 'state/application/hooks'
import { Token } from 'constants/token'
import { Product } from 'utils/fetch/product'
import ConfirmModal from 'components/MgmtPage/ConfirmModal'
import { CURRENCIES } from 'constants/currencies'
import Spinner from 'components/Spinner'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useSwitchChainModal } from 'hooks/useSwitchChainModal'

enum ErrorType {
  insufficientBalance = 'Insufficient Balance',
  singleLimitExceed = 'Single Limit Exceeded'
}

export function MgmtForm({
  data,
  inputPlaceholder,
  amount,
  onChange,
  onMax,
  error,
  children,
  account,
  pending,
  onSubscribe,
  currentCurrency,
  product,
  confirmData,
  balance,
  subStr,
  unit,
  infoText
}: {
  data: { [key: string]: any }
  confirmData: { [key: string]: any }
  inputPlaceholder: string
  amount: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onMax: () => void
  error: string | undefined
  children?: React.ReactNode
  account: string | undefined | null
  pending: boolean
  onSubscribe: (setIsConfirmed: (isConfirmed: boolean) => void) => void
  currentCurrency: Token
  product: Product | undefined
  balance?: string
  subStr?: string
  unit?: string
  infoText: string
}) {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const theme = useTheme()
  const toggleWallet = useWalletModalToggle()
  const { chainId } = useActiveWeb3React()
  const { switchChainCallback } = useSwitchChainModal()
  const isCorrectChain = chainId && chainId === product?.chainId

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

  const handleSubscribe = useCallback(() => {
    onSubscribe(boolean => setIsConfirmed(boolean))
  }, [onSubscribe])

  const handleConfirm = useCallback(() => {
    setIsConfirmed(true)
    setIsConfirmOpen(false)
    handleSubscribe()
  }, [handleSubscribe])

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onDismiss={hideConfirm}
        onConfirm={handleConfirm}
        amount={
          product
            ? (
                +product.multiplier *
                +amount *
                (product ? (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
              ).toFixed(2)
            : '-'
        }
        data={confirmData}
        investCurrency={CURRENCIES[chainId ?? NETWORK_CHAIN_ID][product?.investCurrency ?? 'USDT']}
        title={` ${product?.investCurrency} Financial Management`}
        subTitle={`  [${product?.type === 'CALL' ? 'upward' : 'down'} exercise]`}
        showCancelWarning={false}
      />
      <ActionModal isOpen={isDepositOpen} onDismiss={hideDeposit} token={currentCurrency} type={ActionType.DEPOSIT} />
      <Box
        display="grid"
        flexDirection="column"
        gap={16}
        height="100%"
        width="100%"
        padding="36px 24px"
        position="relative"
      >
        {!product && (
          <Box
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              top: 20,
              left: 20,
              width: 'calc(100% - 20px)',
              height: 'calc(100% - 20px)',
              background: '#ffffff',
              zIndex: 3,
              borderRadius: 2
            }}
          >
            <Spinner size={60} />
          </Box>
        )}
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
          smallPlaceholder
          onDeposit={children ? undefined : showDeposit}
          placeholder={inputPlaceholder}
          disabled={!product || !account || isConfirmed || !isCorrectChain || !product?.isActive}
          value={amount}
          onMax={onMax}
          label={'Subscription Amount'}
          onChange={onChange}
          error={!!error}
          balance={balance}
          unit={unit}
          subStr={subStr}
        />
        {children}
        {!account && <BlackButton onClick={toggleWallet}>Connect Wallet</BlackButton>}
        {account && !isCorrectChain && (
          <BlackButton onClick={switchChainCallback(product?.chainId)}>Switch to {product?.chain}</BlackButton>
        )}
        {!isConfirmed && account && isCorrectChain && (
          <ActionButton
            pending={pending}
            pendingText={'Pending'}
            error={!product?.isActive ? 'Ended' : !amount ? 'Please Input Amount' : ''}
            onAction={showConfirm}
            actionText=" Subscribe"
            disableAction={!product?.isActive ? true : !!error}
            successText={'Ended'}
            success={!product?.isActive}
          />
        )}
        {isConfirmed && account && isCorrectChain && (
          <ActionButton
            pending={pending}
            pendingText={'Pending'}
            error={!product?.isActive ? 'Ended' : !amount ? 'Please Input Amount' : ''}
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
                  </Typography>{' '}
                  Please recharge your account first before opening wealth management
                </>
              ) : (
                <>
                  <Typography component="span" color="error" fontSize={12}>
                    Single Limit Exceeded.
                  </Typography>{' '}
                  Single financial management limit is {product?.multiplier ?? '-'}~
                  {product ? +product?.orderLimit * +product?.multiplier : '-'} BTC
                </>
              )
            ) : (
              <>{infoText}</>
            )}
          </Typography>
        </Box>
      </Box>
    </>
  )
}
