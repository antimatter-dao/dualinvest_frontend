import { Typography, useTheme, Box } from '@mui/material'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import { BTC, USDT } from 'constants/index'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import LogoText from 'components/LogoText'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export default function Referral() {
  const theme = useTheme()

  return (
    <Box mt={48} display="grid" gap={19}>
      <Card padding="38px 24px 60px">
        <Box display="flex" justifyContent="space-between">
          <Box display="grid" gap={8}>
            <Typography color={theme.palette.text.primary} fontSize={24} fontWeight={700}>
              My Referral reward
            </Typography>
            <Typography color={theme.palette.text.secondary} fontSize={16}>
              Recharge to Account to start dual currency wealth management
            </Typography>
          </Box>
          <Typography color={theme.palette.primary.main} fontSize={14}>
            My referrer: 0x344...A507
          </Typography>
        </Box>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={22} mt={34}>
          <NumericalCard title="total Referral reward Value" value="123" unit="$" border />
          <NumericalCard title="Number of referral accounts" value="123" border />
          <Card padding="16px 22px 28px" gray>
            <LogoText logo={<CurrencyLogo currency={BTC} />} text="BTC" />
            <Typography fontSize={24} fontWeight={700} mt={19}>
              6.00
            </Typography>
          </Card>
          <Card padding="16px 22px 28px" gray>
            <LogoText logo={<CurrencyLogo currency={USDT} />} text="USDT" />
            <Typography fontSize={24} fontWeight={700} mt={19}>
              235,987
            </Typography>
          </Card>
        </Box>
      </Card>
      <Card padding="36px 121px 29px 32px">
        <Box display="flex" gap={8}>
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12 }} />
          <Typography fontSize={12} color={theme.palette.text.secondary}>
            A new user who enters the platform through your referral link can form a binding relationship with you, and
            you will receive a reward of 0.5% of the user’s future investment income You can invite countless new
            accounts to increase your revenue, but each new user can only have one referral
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
