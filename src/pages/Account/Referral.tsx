import { useCallback } from 'react'
import { Typography, useTheme, Box } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import { BTC, USDT } from 'constants/index'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import LogoText from 'components/LogoText'
import Button from 'components/Button/Button'
import { useReferalModal } from 'hooks/useReferralModal'

export default function Referral() {
  const theme = useTheme()
  const { openReferralModal } = useReferalModal()

  const handleOpenReferal = useCallback(() => {
    openReferralModal(false)
  }, [openReferralModal])

  return (
    <Box mt={48} display="grid" gap={19}>
      <Card padding="38px 24px 60px">
        <Box display={{ xs: 'grid', sm: 'flex' }} justifyContent="space-between" gap={20}>
          <Box display="grid" gap={8}>
            <Typography color={theme.palette.text.primary} fontSize={24} fontWeight={700}>
              My Referral reward
            </Typography>
            <Typography color={theme.palette.text.secondary} fontSize={16}>
              Recharge to Account to start dual currency wealth management
            </Typography>
          </Box>
          <Typography color={theme.palette.primary.main} fontSize={14} display="flex" alignItems="center" align="right">
            My referrer: 0x344...A507
          </Typography>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={22} mt={34}>
          <NumericalCard title="total Referral reward Value" value="123" unit="$" border fontSize="44px" />
          <NumericalCard title="Number of referral accounts" value="123" border fontSize="44px">
            <Button
              style={{ position: 'absolute', width: 148, height: 44, right: 20, bottom: 20, fontSize: 14 }}
              onClick={handleOpenReferal}
            >
              referral link
            </Button>
          </NumericalCard>
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
      <Card padding="36px 32px 29px 32px">
        <Box display="flex" gap={8}>
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12, width: 12 }} display="inline" />
          <Typography fontSize={12} color={theme.palette.text.secondary} component="span">
            A new user who enters the platform through your referral link can form a binding relationship with you, and
            you will receive a reward of 0.5% of the user’s future investment income
            <br /> You can invite countless new accounts to increase your revenue, but each new user can only have one
            referral
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
