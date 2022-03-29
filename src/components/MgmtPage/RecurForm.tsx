import { Box, Typography } from '@mui/material'
import Tabs from 'components/Tabs/Tabs'
import InputNumerical from 'components/Input/InputNumerical'
import Button, { BlackButton } from 'components/Button/Button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InputLabel from 'components/Input/InputLabel'
import DepositModalButton from 'pages/Account/modals/DepositModalButton'
import { CURRENCIES } from 'constants/currencies'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCallback } from 'react'
import { OutlinedCard } from 'components/Card/Card'
import { ErrorType } from 'pages/RecurringVaultMgmt/VaultForm'
import Divider from 'components/Divider'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChainListMap, NETWORK_CHAIN_ID } from 'constants/chain'
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
  multiplier,
  formula,
  onWithdraw,
  onInvest,
  redeemDisabled,
  investDisabled,
  error
}: {
  formula: string
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
  apy: string
  onInvestChange: (val: string) => void
  investAmount: string
  multiplier: number
  onWithdraw: () => void
  onInvest: () => void
  redeemDisabled: boolean
  investDisabled: boolean
  error: string
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
              multiplier={multiplier}
              formula={formula}
              onClick={onInvest}
              disabled={investDisabled}
            />,
            <Form
              key="redeem"
              type={TYPE.redeem}
              formData={formData}
              currencySymbol={currencySymbol}
              multiplier={multiplier}
              formula={formula}
              onClick={onWithdraw}
              disabled={redeemDisabled}
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
  multiplier,
  formula,
  onClick,
  disabled,
  error
}: {
  type: TYPE
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
  onChange?: (val: string) => void
  val?: string
  multiplier: number
  formula: string
  onClick: () => void
  disabled: boolean
  error?: string
}) {
  const { account, chainId } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  const { switchChainCallback } = useSwitchChainModal()

  const handleMax = useCallback(() => {
    onChange &&
      onChange(
        type === TYPE.invest
          ? Math.floor(+(available ?? 0) / multiplier)
          : formData['Redeemable:'].replace(currencySymbol, '')
      )
  }, [available, currencySymbol, formData, onChange, type, multiplier])

  const handleChange = useCallback(
    e => {
      onChange && onChange(e.target.value ? Math.floor(+e.target.value) + '' : '')
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
        <Box display="flex" alignItems="center">
          <InfoOutlinedIcon sx={{ color: theme => theme.palette.primary.main, height: 14, width: 14, mr: 8 }} />
          <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
            {type === TYPE.redeem ? (
              <> your redeem amount will be available for withdraw once the current cycle finishes.</>
            ) : (
              <>Your deposit allows us to invest your {currencySymbol} in the strategy by default.</>
            )}
          </Typography>
        </Box>
      </Box>
      {type === TYPE.invest && val !== undefined && onChange && (
        <Box>
          <InputNumerical
            error={!!error && error !== ErrorType.notAvailable}
            smallPlaceholder
            placeholder={`Each unit represents ${multiplier} ${currencySymbol}`}
            onChange={handleChange}
            onMax={handleMax}
            value={val}
            disabled={!account || chainId !== NETWORK_CHAIN_ID || error === ErrorType.notAvailable}
          />

          <Box mt={12}>
            <Box display="flex" justifyContent="space-between">
              <InputLabel>{TYPE.invest} Amount</InputLabel>
              <Box display="flex" alignItems="flex-start" gap="5px">
                <>
                  <InputLabel>
                    Available: {available ? available : '-'}
                    {currencySymbol}
                  </InputLabel>
                  {chainId === NETWORK_CHAIN_ID && (
                    <DepositModalButton currentCurrency={CURRENCIES[chainId ?? NETWORK_CHAIN_ID][currencySymbol]} />
                  )}
                </>
              </Box>
            </Box>
            <OutlinedCard>
              <Box height="60px" display="flex" alignItems="center" padding="16px" justifyContent="space-between">
                <>
                  <Typography
                    component="span"
                    color="primary"
                    fontSize={16}
                    maxWidth={'55%'}
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {(multiplier * +val).toFixed(2)} {currencySymbol}
                  </Typography>
                  <Typography
                    component="span"
                    fontSize={12}
                    sx={{ color: theme => theme.palette.text.secondary, wordBreak: 'break-all' }}
                    maxWidth={'45%'}
                  >
                    ={val}*{formula}
                  </Typography>
                </>
              </Box>
            </OutlinedCard>
            <Box display="flex" mt={8} justifyContent="space-between">
              <Typography fontSize={12} sx={{ opacity: 0.5 }}>
                <span>
                  Min:{multiplier} {currencySymbol}
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      <Box mt={16}>
        {account && !(chainId === NETWORK_CHAIN_ID) && (
          <BlackButton onClick={switchChainCallback(NETWORK_CHAIN_ID)}>
            Switch to {ChainListMap[NETWORK_CHAIN_ID].name}
          </BlackButton>
        )}
        {account && chainId === NETWORK_CHAIN_ID && (
          <Button onClick={onClick} disabled={disabled || !!error}>
            {type}
          </Button>
        )}

        {!account && <BlackButton onClick={toggleWallet}>Connect</BlackButton>}
      </Box>
      {error && (
        <Box display="flex" mt={8}>
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
        </Box>
      )}
    </Box>
  )
}
