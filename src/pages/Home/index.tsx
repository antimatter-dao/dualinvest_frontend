import { Box, Grid, Typography, styled } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { ReactComponent as HomeSvg } from 'assets/svg/home.svg'
import LogoText from 'components/LogoText'
import checkUrl from 'assets/images/check.png'
import Image from 'components/Image'
import NumericalCard from 'components/Card/NumericalCard'
import Button from 'components/Button/Button'
import securityUrl from 'assets/images/security.png'
import highReturnUrl from 'assets/images/high_return.png'
import flexibleUrl from 'assets/images/flexible.png'
import dualInvestUrl from 'assets/svg/home_dual_invest.svg'
import chainOptionUrl from 'assets/svg/home_chain_option.svg'
import recurringVaultUrl from 'assets/svg/home_recurring_vault.svg'
import Card from 'components/Card/Card'
import { routes } from 'constants/routes'
import { useBindModal } from 'hooks/useReferralModal'

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
  const history = useHistory()
  useBindModal()
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
        gap={80}
        margin={{ xs: '0px 20px' }}
        sx={{
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, lg: theme.width.maxContent })
        }}
      >
        <Grid container spacing={{ xs: 8, md: 20 }}>
          <Grid item xs={12} md={6}>
            <NumericalCard
              width={'100%'}
              title={'Total investment amount'}
              value={'111'}
              fontSize={'44px'}
              unit="USDT"
              border
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <NumericalCard
              width={'100%'}
              title={'Amount of investment in progress'}
              value={'111'}
              fontSize={'44px'}
              unit="USDT"
              border
            />
          </Grid>
        </Grid>

        <Box display="grid" gap={32}>
          <Typography fontSize={48} fontWeight={700}>
            Dual Investment
          </Typography>
          <Grid container spacing={20}>
            <ProductCard
              src={dualInvestUrl}
              title="Dual Investment"
              synospis="Earn both ups and downs within a fluctuation range"
              onClick={() => {
                history.push(routes.dualInvest)
              }}
            />
            <ProductCard
              src={dualInvestUrl}
              title="Dual Investment Plus"
              synospis="Dual Investment standard + advanced settings"
            />
          </Grid>
        </Box>
        <Box display="grid" gap={32}>
          <Typography fontSize={48} fontWeight={700}>
            Recurring Vault
          </Typography>
          <Grid container spacing={20}>
            <ProductCard
              large
              src={recurringVaultUrl}
              title="Recurring Vault"
              synospis="Automatic management of funds, cyclic compound interest.
              Earn Yield on your idle assets"
              onClick={() => {
                history.push(routes.recurringVault)
              }}
            />
          </Grid>
        </Box>
        <Box display="grid" gap={32}>
          <Typography fontSize={48} fontWeight={700}>
            Chain Option
          </Typography>
          <Grid container spacing={20}>
            <ProductCard
              src={chainOptionUrl}
              title="Saddle Options"
              synospis="Suitable to buy when the price will fluctuate for a period of time"
              // onClick={() => {
              //   history.push(routes.chainOptionTyped.replace(':type', 'saddle'))
              // }}
            />
            <ProductCard
              src={chainOptionUrl}
              title="Tiered Options"
              synospis="Suitable for buying when the price will continue to rise or fall for a period of time"
              // onClick={() => {
              //   history.push(routes.chainOptionTyped.replace(':type', 'tiered'))
              // }}
            />
          </Grid>
        </Box>

        <Box display="grid" gap={32}>
          <Typography fontSize={48} fontWeight={700}>
            Features
          </Typography>
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

function ProductCard({
  src,
  title,
  synospis,
  actionText,
  onClick,
  large
}: {
  src: string
  title: string
  synospis: string
  actionText?: string
  onClick?: () => void
  large?: boolean
}) {
  return (
    <Grid item xs={12} sm={large ? 12 : 6}>
      <Card>
        <Box
          padding={large ? '0 24px' : '32px 24px'}
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          rowGap={25}
          columnGap={20}
        >
          <Box paddingTop={large ? '32px' : 0}>
            <Typography fontSize={24} fontWeight={700}>
              {title}
            </Typography>
            <Typography sx={{ color: theme => theme.palette.text.secondary, mt: 8 }}>{synospis}</Typography>
          </Box>

          <Button disabled={!onClick} onClick={onClick} style={{ marginBottom: large ? '32px' : 0 }}>
            {!onClick ? 'Coming soon' : actionText ?? 'Start now'}
          </Button>
          <Image
            src={src}
            style={{
              opacity: !onClick ? 0.5 : 1,
              marginLeft: 'auto',
              gridRowStart: { xs: '2', md: '1' },
              gridRowEnd: { xs: 'span 1', md: 'span 2' },
              height: '100%',
              width: '100%',
              gridColumnStart: { xs: 'unset', md: '2' }
            }}
          />
        </Box>
      </Card>
    </Grid>
  )
}
