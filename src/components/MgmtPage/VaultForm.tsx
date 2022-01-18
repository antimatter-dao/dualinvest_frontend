import { Box, Typography } from '@mui/material'
import Tabs from 'components/Tabs/Tabs'
import NumericalInput from 'components/Input/InputNumerical'
import Button from 'components/Button/Button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InputLabel from 'components/Input/InputLabel'
import DepositModalButton from 'pages/Account/modals/DepositModalButton'
import { CURRENCIES } from 'constants/currencies'

enum TYPE {
  compound = 'Compound',
  redeem = 'Redeem'
}

const formData = {
  ['Current cycle Invested amount：']: '5BTC',
  ['Next cycle invest amount：']: '0.23BTC',
  ['Redeemable:']: '5.23BTC'
}

export default function VaultForm() {
  return (
    <Box width="100%">
      <Tabs
        titles={['Compound', 'Redeem']}
        tabPadding="12px"
        contents={[<Form key="compound" type={TYPE.compound} />, <Form key="redeem" type={TYPE.redeem} />]}
      />
    </Box>
  )
}

function Form({ type }: { type: TYPE }) {
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
          <InputLabel>Available: 5BTC</InputLabel>
          <DepositModalButton currentCurrency={CURRENCIES.BTC} />
        </Box>

        <NumericalInput placeholder="0.00" onChangeCapture={() => {}} onMax={() => {}} unit="BTC" value="0" />
      </Box>
      <Box mt={16}>
        <Button>{type}</Button>
        <Box mt={8} sx={{ opacity: type === TYPE.redeem ? 0 : 1 }}>
          <InfoOutlinedIcon sx={{ color: theme => theme.palette.primary.main, height: 12 }} />
          <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
            Once subscribed, the subscribed products cannot be cancelled.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
