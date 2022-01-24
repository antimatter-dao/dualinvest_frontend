import { Box, Typography } from '@mui/material'
import Tabs from 'components/Tabs/Tabs'
import NumericalInput from 'components/Input/InputNumerical'
import Button, { BlackButton } from 'components/Button/Button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InputLabel from 'components/Input/InputLabel'
import DepositModalButton from 'pages/Account/modals/DepositModalButton'
import { CURRENCIES } from 'constants/currencies'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

enum TYPE {
  invest = 'Invest',
  redeem = 'Redeem'
}

export default function VaultForm({
  formData,
  currencySymbol,
  available
}: {
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
}) {
  return (
    <Box width="100%">
      <Tabs
        titles={['Invest', 'Redeem']}
        tabPadding="12px"
        contents={[
          <Form
            key="compound"
            type={TYPE.invest}
            formData={formData}
            currencySymbol={currencySymbol}
            available={available}
          />,
          <Form key="redeem" type={TYPE.redeem} formData={formData} currencySymbol={currencySymbol} />
        ]}
      />
    </Box>
  )
}

function Form({
  type,
  formData,
  currencySymbol,
  available
}: {
  type: TYPE
  formData: { [key: string]: any }
  currencySymbol: string
  available?: string
}) {
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={16} pt={35} pb={42}>
        {Object.keys(formData).map(key => (
          <Box key={key} display="flex" justifyContent="space-between">
            <Typography fontSize={16}>{key}</Typography>
            <Typography fontSize={16}>{formData[key as keyof typeof formData]}</Typography>
          </Box>
        ))}
      </Box>
      <Box>
        <Box display="flex" alignItems="flex-start" gap="5px">
          {type === TYPE.invest ? (
            <>
              <InputLabel>
                Available: {available ? available : '-'}
                {currencySymbol}
              </InputLabel>
              <DepositModalButton currentCurrency={CURRENCIES[currencySymbol]} />
            </>
          ) : (
            <>
              <InputLabel>Redeemable amount: {formData['Redeemable:']}</InputLabel>
            </>
          )}
        </Box>

        <NumericalInput
          placeholder="0.00"
          onChangeCapture={() => {}}
          onMax={() => {}}
          unit="BTC"
          value="0"
          disabled={!account}
        />
      </Box>
      <Box mt={16}>
        {account ? <Button>{type}</Button> : <BlackButton onClick={toggleWallet}>Connect</BlackButton>}
        <Box mt={8} sx={{ opacity: type === TYPE.redeem ? 0 : 1 }}>
          <InfoOutlinedIcon sx={{ color: theme => theme.palette.primary.main, height: 12 }} />
          <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
            Your deposit is a strategy that allows us to invest your {currencySymbol} in the vault by default.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
