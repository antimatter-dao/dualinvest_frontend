import { Box, Grid, Typography, styled } from '@mui/material'
import { ReactComponent as HomeSvg } from 'assets/svg/home.svg'
import LogoText from 'components/LogoText'
import checkUrl from 'assets/images/check.png'
import Image from 'components/Image'
import NumericalCard from 'components/Card/NumericalCard'

import securityUrl from 'assets/images/security.png'
import highReturnUrl from 'assets/images/high_return.png'
import flexibleUrl from 'assets/images/flexible.png'
import Card from 'components/Card/Card'

const StyledHomeSvg = styled(HomeSvg)(({ theme }) => ({
  flexShrink: 1,
  minHeight: 200,
  height: '30vh',
  maxHeight: 340,
  [theme.breakpoints.down('md')]: {
    width: 'calc(100vw - 80px)',
    margin: '0 auto -20px 0'
    // minHeight: 'unset',
    // height: 'auto',
    // maxHeight: 'unset'
  }
}))

export default function Home() {
  return (
    <Box
      display="grid"
      justifyItems={{ xs: 'flex-start', md: 'center' }}
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      gap={{ xs: 36, md: 48 }}
    >
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          width: '100%',
          minHeight: 200,
          height: { ms: 'auto', md: '30vh' },
          maxHeight: { ms: 'unset', md: 340 },
          background: theme => theme.palette.background.paper,
          padding: { xs: '20px', md: '40px', lg: '44px 61px' }
        }}
      >
        <Box
          sx={{ maxWidth: theme => ({ xs: 'calc(100vw - 88px)', md: theme.width.maxContent }) }}
          width="100%"
          display={{ xs: 'grid', sm: 'flex' }}
          justifyContent={{ sm: 'center', md: 'space-between' }}
          alignItems="center"
        >
          <Box display="grid" gap={12}>
            <Typography component="h1" sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700 }}>
              Antimatter Invest
            </Typography>
            <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 8, md: 32 }} paddingBottom={{ xs: 16, md: 30 }}>
              <LogoText
                logo={<Image src={checkUrl} />}
                text={
                  <Typography sx={{ fontSize: { xs: 14, md: 18 }, opacity: 0.8 }}>
                    Simple, safe, high-yield digital asset management
                  </Typography>
                }
              />
            </Box>
          </Box>
          <StyledHomeSvg />
        </Box>
      </Box>
      <Box
        id="up"
        display="grid"
        width="100%"
        gap={8}
        margin={{ xs: '0px 20px' }}
        sx={{
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        <Grid container spacing={{ xs: 8, md: 20 }}>
          <Grid item xs={12} md={4}>
            <NumericalCard
              width={'100%'}
              value={
                '111'
                // statistics && BTCPrice
                //   ? trimNumberString(
                //       (+statistics.totalBtcDeposit * +BTCPrice + +statistics.totalUsdtDeposit).toLocaleString(),
                //       0
                //     )
                //   : '-'
              }
              unit="USDT"
              border
              subValue="Cumulative Deposit Amount"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumericalCard
              width={'100%'}
              value={'111'}
              // value={statistics ? trimNumberString((+statistics.totalInvestAmount).toLocaleString(), 0) : '-'}
              unit="USDT"
              border
              subValue="Cumulative Investment Amount"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumericalCard
              width={'100%'}
              value={'111'}
              // value={statistics ? trimNumberString((+statistics.totalInvestAmount).toLocaleString(), 0) : '-'}
              unit="USDT"
              border
              subValue="Cumulative Investment Amount"
            />
          </Grid>
        </Grid>

        <Box
          display="flex"
          alignContent="center"
          justifyContent="center"
          maxWidth={theme => ({ xs: `calc(100vw - 40px)`, md: theme.width.maxContent })}
          margin={{ xs: '0px 20px' }}
        >
          <Grid container sx={{ justifyContent: 'space-between' }} spacing={20}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={
                  <Image
                    src={securityUrl}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: 'contain',
                      WebkitTransform: 'scaleX(-1)',
                      transform: 'scaleX(-1)'
                    }}
                  />
                }
                title="Security"
                content="Top-level security infrastructure and risk control measures to protect asset safety"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<Image src={highReturnUrl} style={{ width: 56, height: 56, objectFit: 'contain' }} />}
                title="High Return"
                content="We ensure your APY gets locked in on subscription. Enjoy high fixed yield!"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<Image src={flexibleUrl} style={{ width: 56, height: 56, objectFit: 'contain' }} />}
                title="Flexible Experience"
                content="High flexibility and low barriers for participation "
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

function FeatureCard({ icon, title, content }: { icon: JSX.Element; title: string; content: string }) {
  return (
    <Card style={{ height: '100%' }}>
      <Box display="grid" sx={{ '& img': { mixBlendMode: 'multiply' }, padding: '30px 24px' }} height="100%" gap={15}>
        {icon}
        <Typography sx={{ mt: 20 }} fontWeight={700} fontSize={24}>
          {title}
        </Typography>
        <Typography sx={{ color: theme => theme.palette.text.secondary, fontSize: 16 }}>{content}</Typography>
      </Box>
    </Card>
  )
}
