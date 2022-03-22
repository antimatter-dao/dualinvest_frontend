import { Box, Typography } from '@mui/material'
import Tabs from 'components/Tabs/Tabs'
import InputNumerical from 'components/Input/InputNumerical'
import Button, { BlackButton } from 'components/Button/Button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCallback } from 'react'
import { ErrorType } from 'pages/DefiVaultMgmt/VaultForm'
import Divider from 'components/Divider'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChainId, SUPPORTED_NETWORKS } from 'constants/chain'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { CURRENCIES } from 'constants/currencies'
import { tryParseAmount } from 'utils/parseAmount'
import { DEFI_VAULT_ADDRESS } from 'constants/index'
import ActionButton from 'components/Button/ActionButton'
import { useSwitchChainModal } from 'hooks/useSwitchChainModal'

enum TYPE {
  invest = 'Invest',
  redeem = 'Redeem'
}

export default function VaultForm({
  formData,
  currencySymbol,
  available,
  apy,
  onInvestChange,
  investAmount,
  onWithdraw,
  onInvest,
  redeemDisabled,
  investDisabled,
  error,
  productChainId,
  isCall
}: {
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
  apy: string
  onInvestChange: (val: string) => void
  investAmount: string
  onWithdraw: () => void
  onInvest: () => void
  redeemDisabled: boolean
  investDisabled: boolean
  error: string
  productChainId: ChainId | undefined
  isCall?: boolean
}) {
  const isDownSm = useBreakpoint('sm')

  return (
    <Box width="100%">
      {isDownSm && <Divider sx={{ opacity: 0.1 }} />}
      <Box mt={12} position="relative">
        <Tabs
          titles={['Invest', 'Redeem']}
          tabPadding="12px 0px 12px 0px"
          contents={[
            <Form
              error={error}
              key="invest"
              type={TYPE.invest}
              formData={formData}
              currencySymbol={currencySymbol}
              available={available}
              onChange={onInvestChange}
              val={investAmount}
              onClick={onInvest}
              disabled={investDisabled}
              productChainId={productChainId}
              isCall={isCall}
            />,
            <Form
              key="redeem"
              type={TYPE.redeem}
              formData={formData}
              currencySymbol={currencySymbol}
              onClick={onWithdraw}
              disabled={redeemDisabled}
              productChainId={productChainId}
              isCall={isCall}
            />
          ]}
        />
        <Typography
          position="absolute"
          sx={{ top: 0, right: 0, height: 48 }}
          display="flex"
          alignItems={'center'}
          variant="inherit"
        >
          APY:
          <Typography component={'span'} color="primary" fontWeight={700} variant="inherit" ml={5}>
            {apy}
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

function Form({
  type,
  formData,
  currencySymbol,
  available,
  onChange,
  val,
  onClick,
  disabled,
  error,
  productChainId,
  isCall
}: {
  type: TYPE
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
  onChange?: (val: string) => void
  val?: string
  onClick: () => void
  disabled: boolean
  error?: string
  productChainId: ChainId | undefined
  isCall?: boolean
}) {
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  const { chainId } = useActiveWeb3React()
  const [approvalState, approveCallback] = useApproveCallback(
    tryParseAmount(val, productChainId ? CURRENCIES[productChainId ?? '']?.[currencySymbol] : undefined),
    productChainId ? DEFI_VAULT_ADDRESS[productChainId]?.[currencySymbol]?.[isCall ? 'CALL' : 'PUT'] : undefined
  )
  const { switchChainCallback } = useSwitchChainModal()
  console.log(approvalState)
  const handleMax = useCallback(() => {
    onChange &&
      onChange(type === TYPE.invest ? +(available ?? '0') : formData['Redeemable:'].replace(currencySymbol, ''))
  }, [available, currencySymbol, formData, onChange, type])

  const handleChange = useCallback(
    e => {
      onChange && onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={16} pt={35} pb={35}>
        {Object.keys(formData).map(key => (
          <Box key={key} display="flex" justifyContent="space-between">
            <Typography fontSize={16}>{key}</Typography>
            <Typography fontSize={16}>{formData[key as keyof typeof formData]}</Typography>
          </Box>
        ))}
      </Box>
      {type === TYPE.invest && val !== undefined && onChange && (
        <Box>
          <InputNumerical
            label={`${TYPE.invest} Amount`}
            balance={available ? available : '-'}
            unit={currencySymbol}
            error={!!error && error !== ErrorType.notAvailable}
            smallPlaceholder
            placeholder={'0.00'}
            onChange={handleChange}
            onMax={handleMax}
            value={val}
            disabled={!account || error === ErrorType.notAvailable || chainId !== productChainId}
          />
        </Box>
      )}
      <Box mt={16}>
        {account && chainId === productChainId && approvalState !== ApprovalState.APPROVED && (
          <ActionButton
            actionText="Approve"
            onAction={approveCallback}
            disableAction={disabled || !!error}
            pending={approvalState === ApprovalState.PENDING}
            pendingText="Approving"
          ></ActionButton>
        )}
        {account && chainId === productChainId && approvalState === ApprovalState.APPROVED && (
          <Button onClick={onClick} disabled={disabled || !!error}>
            {type}
          </Button>
        )}
        {account && !(chainId === productChainId) && (
          <BlackButton onClick={switchChainCallback(productChainId)}>
            Switch to {productChainId && SUPPORTED_NETWORKS[productChainId]?.chainName}
          </BlackButton>
        )}
        {!account && <BlackButton onClick={toggleWallet}>Connect</BlackButton>}
      </Box>

      <Box display="flex" alignItems="center" mt={8}>
        {error ? (
          <>
            <InfoOutlinedIcon sx={{ color: theme => theme.palette.error.main, height: 12 }} />
            <Typography component="p" fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
              {
                <>
                  <Typography component="span" color="error" fontSize={12}>
                    {error}
                  </Typography>
                </>
              }
            </Typography>
          </>
        ) : (
          <>
            <InfoOutlinedIcon sx={{ color: theme => theme.palette.primary.main, height: 14, width: 14, mr: 8 }} />
            <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
              {type === TYPE.redeem ? (
                <> your redeem amount will be available for withdraw once the current cycle finishes.</>
              ) : (
                <>Your deposit allows us to invest your {currencySymbol} in the strategy by default.</>
              )}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  )
}
