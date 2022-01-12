import { Box, Typography } from '@mui/material'
import Tabs from 'components/Tabs/Tabs'
import NumericalInput from 'components/Input/InputNumerical'
import Button from 'components/Button/Button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

enum TYPE {
  compound = 'Compound',
  redeem = 'Redeem'
}

const formData = {
  ['Compound Balance']: '5BTC',
  ['Redeemable']: '0.23BTC',
  ['Total']: '5.23BTC'
}

export default function VaultForm() {
  return (
    <Box width="100%">
      <Tabs
        titles={['Compound', 'Redeem']}
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
            <Typography>{key}</Typography>
            <Typography>{formData[key as keyof typeof formData]}</Typography>
          </Box>
        ))}
      </Box>
      <NumericalInput
        label="Available: 5BTC"
        placeholder="0.00"
        onChangeCapture={() => {}}
        onMax={() => {}}
        unit="BTC"
        value="0"
      />
      <Box mt={16}>
        <Button>{type}</Button>
        <Box>
          <InfoOutlinedIcon sx={{ color: theme => theme.palette.primary.main, height: 12 }} />
          <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
            Once subscribed, the subscribed products cannot be cancelled.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
