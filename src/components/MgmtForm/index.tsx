import { ChangeEvent, useState, useCallback } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import Divider from 'components/Divider'
import InputNumerical from 'components/Input/InputNumerical'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ActionButton from 'components/Button/ActionButton'
import { BlackButton } from 'components/Button/Button'
import ActionModal, { ActionType } from 'pages/Account/modals/ActionModal'

export function MgmtForm({
  data,
  inputPlaceholder,
  inputDisabled,
  actionDisabled,
  amount,
  onChange,
  onMax,
  error,
  children,
  isConfirmed,
  account,
  pending,
  onSubscribe
}: {
  data: { [key: string]: any }
  inputPlaceholder: string
  inputDisabled: boolean
  amount: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onMax: () => void
  error: string | undefined
  children: React.ReactNode
  isConfirmed: boolean
  account: string | undefined
  pending: boolean
  onSubscribe: () => void
}) {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const theme = useTheme()
  const toggleWallet = useWalletModalToggle()

  const showDeposit = useCallback(() => {
    setIsDepositOpen(true)
  }, [])

  const hideDeposit = useCallback(() => {
    setIsDepositOpen(false)
  }, [])

  return (
    <>
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
          smallPlaceholder
          placeholder={inputPlaceholder}
          disabled={disabled}
          value={amount}
          onMax={onMax}
          label={'Subscription Amount'}
          onChange={onChange}
          error={!!error}
        />
        {children}
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
            onAction={onSubscribe}
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
