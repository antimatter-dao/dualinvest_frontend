import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Typography, useTheme } from '@mui/material'
import { CURRENCIES } from 'constants/currencies'
import Card from 'components/Card/Card'
import ConfirmModal from 'components/MgmtPage/ConfirmModal'

export default function VaultConfirmModal({ confirmData }: { confirmData: { [key: string]: any } }) {
  const theme = useTheme()
  return (
    <ConfirmModal
      isOpen={false}
      onDismiss={() => {}}
      onConfirm={() => {}}
      amount="0.000"
      data={confirmData}
      title={'Compound Confirm'}
      subTitle={'【BTC Put Selling Vault】'}
      investCurrency={CURRENCIES['USDT']}
    >
      <Card
        color={theme.palette.error.light}
        style={{ marginTop: 21, border: '1px solid ' + theme.palette.error.main, borderRadius: '8px' }}
      >
        <Box padding="12px 15px" display="flex" gap="7px">
          <InfoOutlinedIcon sx={{ color: theme.palette.error.main, height: 12 }} />
          <Typography fontSize={12} color={theme.palette.error.main} fontWeight={300}>
            when the final result is exercised, we will settle in another currency and invest again in the settlement
            currency&apos;s vault.
            <br />
            <br /> Once compound interest is confirmed, it cannot be canceled halfway. When compound interest is in
            progress, you can choose to stop the next compound interest.
          </Typography>
        </Box>
      </Card>
    </ConfirmModal>
  )
}
