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
  onRedeemChange,
  investAmount,
  redeemAmount,
  multiplier,
  formula
}: {
  formula: string
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
  apy: string
  onInvestChange: (val: string) => void
  onRedeemChange: (val: string) => void
  investAmount: string
  redeemAmount: string
  multiplier: number
}) {
  return (
    <Box width="100%" position="relative">
      <Tabs
        titles={['Invest', 'Redeem']}
        tabPadding="12px"
        contents={[
          <Form
            key="invest"
            type={TYPE.invest}
            formData={formData}
            currencySymbol={currencySymbol}
            available={available}
            onChange={onInvestChange}
            val={investAmount}
            multiplier={multiplier}
            formula={formula}
          />,
          <Form
            key="redeem"
            type={TYPE.redeem}
            formData={formData}
            currencySymbol={currencySymbol}
            onChange={onRedeemChange}
            val={redeemAmount}
            multiplier={multiplier}
            formula={formula}
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
  formula
}: {
  type: TYPE
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
  onChange: (val: string) => void
  val: string
  multiplier: number
  formula: string
}) {
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()

  const handleMax = useCallback(() => {
    onChange(
      type === TYPE.invest
        ? Math.floor(+(available ?? 0) / multiplier)
        : formData['Redeemable:'].replace(currencySymbol, '')
    )
  }, [available, currencySymbol, formData, onChange, type, multiplier])

  const handleChange = useCallback(
    e => {
      onChange(e.target.value ? Math.floor(+e.target.value) + '' : '')
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
              <>Your deposit is a strategy that allows us to invest your {currencySymbol} in the vault by default.</>
            )}
          </Typography>
        </Box>
      </Box>
      {type === TYPE.invest && (
        <Box>
          <InputNumerical
            smallPlaceholder
            placeholder={`Each unit represents ${multiplier} ${currencySymbol}`}
            onChange={handleChange}
            onMax={handleMax}
            value={val}
            disabled={!account}
          />
          <Box mt={12}>
            <Box display="flex" justifyContent="space-between">
              <InputLabel>{TYPE.invest} Amount</InputLabel>
              <Box display="flex" alignItems="flex-start" gap="5px">
                {/*  {type === TYPE.invest ? (*/}
                <>
                  <InputLabel>
                    Available: {available ? available : '-'}
                    {currencySymbol}
                  </InputLabel>
                  <DepositModalButton currentCurrency={CURRENCIES[currencySymbol]} />
                </>
                {/* ) : (
                  <>
                    <InputLabel>Redeemable amount: {formData['Redeemable:']}</InputLabel>
                  </>
               )}*/}
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
      <Box mt={16}>{account ? <Button>{type}</Button> : <BlackButton onClick={toggleWallet}>Connect</BlackButton>}</Box>
    </Box>
  )
}
