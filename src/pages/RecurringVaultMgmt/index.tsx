import { useMemo } from 'react'
import { Typography, styled, Box, useTheme } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MgmtPage from 'components/MgmtPage'
import { routes } from 'constants/routes'
import { Subject } from 'components/MgmtPage/stableContent'
import ConfirmModal from 'components/MgmtPage/ConfirmModal'
import { feeRate } from 'constants/index'
import { CURRENCIES } from 'constants/currencies'
import Card from 'components/Card/Card'

const StyledUnorderList = styled('ul')(({ theme }) => ({
  paddingLeft: '14px',
  color: '#808080',
  '& li': {
    marginTop: 10,
    fontSize: 15.5
  },
  '& li span': {
    color: '#252525'
  },
  '& li::marker': {
    color: theme.palette.primary.main
  }
}))

export default function RecurringValueMgmt() {
  const theme = useTheme()

  const confirmData = useMemo(
    () => ({
      ['Platform service fee']: feeRate,
      ['Spot Price']: '59,000 USDT',
      ['APY']: '140.25%',
      ['Strike Price']: '62,800 USDT',
      ['Delivery Date']: '29 Oct 2021'
      // ['Spot Price']: product?.currentPrice ?? '-' + ' USDT',
      // ['APY']: product?.apy ? (+product.apy * 100).toFixed(2) + '%' : '- %',
      // ['Strike Price']: product?.strikePrice ?? '-' + ' USDT',
      // ['Delivery Date']: product ? dayjs(product.expiredAt).format('DD MMM YYYY') + ' 08:30:00 AM UTC' : '-'
    }),
    []
  )

  const returnOnInvestment = useMemo(() => {
    return (
      <div>
        <Typography fontSize={16} color={theme.palette.text.primary}>
          Return on investment:
        </Typography>
        <StyledUnorderList>
          <li>Start at 11-29 09:00.</li>
          <li>
            If the BTC price can keep rising within 24 hours, you will receive a reward of up to{' '}
            <span style={{ color: theme.palette.text.primary }}>220.00 USDT</span>.
          </li>
          <li>If the BTC price down in a certain range, it will be eliminated and your total income will be settled</li>
          <li>
            If the first interval down, you will get&nbsp;
            <span style={{ color: theme.palette.text.primary }}>20 USDT</span> compensation
          </li>
        </StyledUnorderList>
      </div>
    )
  }, [theme.palette.text.primary])

  return (
    <>
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
      <MgmtPage
        showFaq={false}
        backLink={routes.recurringVault}
        product={undefined}
        pageTitle={`test`}
        returnOnInvestment={returnOnInvestment}
        subject={Subject.RecurringVault}
        chart={undefined}
        subscribeForm={<Box />}
      />
    </>
  )
}
