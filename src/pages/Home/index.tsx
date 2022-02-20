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
import SaddleOptionUrl from 'assets/svg/home_saddle_option.svg'
import TieredOptionUrl from 'assets/svg/home_tiered_option.svg'
import recurringVaultUrl from 'assets/svg/home_recurring_vault.svg'
import Card from 'components/Card/Card'
import { routes } from 'constants/routes'
import { useBindModal } from 'hooks/useReferralModal'
import { useHomeStatistics } from 'hooks/useStatistics'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledHomeSvg = styled(HomeSvg)(({ theme }) => ({
  flexShrink: 0,
  minHeight: 200,
  height: 340,
  maxHeight: 340,
  [theme.breakpoints.down('md')]: {
    height: 221,
    width: 'calc(100vw - 80px)'
  }
}))

export default function Home() {
  const history = useHistory()
  const isDownMd = useBreakpoint('md')
  useBindModal()
  const { totalInvest, totalProgress } = useHomeStatistics()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      gap={{ xs: 36, md: 80 }}
    >
      <Box
        display={{ xs: 'grid', md: 'flex' }}
        justifyContent="center"
        sx={{
          width: '100%',
          height: { xs: 'auto', md: '340px' },
          background: theme => theme.palette.background.paper,
          padding: { xs: '32px 20px', md: '44px 61px' }
        }}
      >
        <Box
          sx={{ maxWidth: theme => ({ md: theme.width.maxContent }) }}
          width="100%"
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent={{ sm: 'center', md: 'space-between' }}
          alignItems={{ xs: 'unset', md: 'center' }}
        >
          <Box display="grid" gap={12}>
            <Typography
              component="h1"
              sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700, textAlign: { xs: 'center', md: 'left' } }}
            >
              Structured Products
            </Typography>
            <LogoText
              logo={<Image src={checkUrl} />}
              text={
                <Typography sx={{ fontSize: { xs: 14, md: 24 }, opacity: 0.8 }}>
                  Simple, safe, high-yield digital asset management
                </Typography>
              }
            />
          </Box>

          {isDownMd ? (
            <Box
              mt={24}
              width="100%"
              height={221}
              borderRadius="16px"
              border="1px solid rgba(0,0,0,0.1)"
              display="flex"
              justifyContent="center"
            >
              <StyledHomeSvg />
            </Box>
          ) : (
            <StyledHomeSvg />
          )}
        </Box>
      </Box>
      <Box
        display="grid"
        width="100%"
        gap={{ xs: 36, md: 80 }}
        margin={{ xs: '0px 20px' }}
        sx={{
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, lg: theme.width.maxContent })
        }}
      >
        <Grid container spacing={{ xs: 8, md: 20 }}>
          <Grid item xs={12} md={6}>
            <NumericalCard
              width={'100%'}
              title={isDownMd ? undefined : 'Total investment amount'}
              value={totalInvest}
              fontSize={isDownMd ? '20px' : '44px'}
              unit="USDT"
              unitSize={isDownMd ? '12px' : '16px'}
              border
              subValue={isDownMd ? 'Total investment amount' : undefined}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <NumericalCard
              width={'100%'}
              title={isDownMd ? undefined : 'Amount of investment in progress'}
              value={totalProgress}
              fontSize={isDownMd ? '20px' : '44px'}
              unit="USDT"
              unitSize={isDownMd ? '12px' : '16px'}
              border
              subValue={isDownMd ? 'Amount of investment in progress' : undefined}
            />
          </Grid>
        </Grid>

        <Box display="grid" gap={{ xs: 16, md: 32 }}>
          <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={700}>
            Dual Investment
          </Typography>
          <Grid container spacing={{ xs: 12, md: 20 }}>
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
        <Box display="grid" gap={{ xs: 16, md: 32 }}>
          <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={700}>
            Recurring Strategy
          </Typography>
          <Grid container spacing={20}>
            <ProductCard
              large
              actionText="Explore"
              src={recurringVaultUrl}
              title="Recurring Strategy"
              synospis="Automatic management of funds, cyclic compound interest.
              Earn Yield on your idle assets"
              onClick={() => {
                history.push(routes.recurringVault)
              }}
            />
          </Grid>
        </Box>
        <Box display="grid" gap={{ xs: 16, md: 32 }}>
          <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={700}>
            Chain Option
          </Typography>
          <Grid container spacing={{ xs: 12, md: 20 }}>
            <ProductCard
              src={SaddleOptionUrl}
              title="Saddle Options"
              synospis="Suitable to buy when the price will fluctuate for a period of time"
              // onClick={() => {
              //   history.push(routes.chainOptionTyped.replace(':type', 'saddle'))
              // }}
            />
            <ProductCard
              src={TieredOptionUrl}
              title="Tiered Options"
              synospis="Suitable for buying when the price will continue to rise or fall for a period of time"
              // onClick={() => {
              //   history.push(routes.chainOptionTyped.replace(':type', 'tiered'))
              // }}
            />
          </Grid>
        </Box>

        <Box display="grid" gap={{ xs: 16, md: 32 }}>
          <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={700}>
            Features
          </Typography>
          <Grid container sx={{ justifyContent: 'space-between' }} spacing={{ xs: 8, md: 20 }}>
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
  const isDownMd = useBreakpoint('md')
  return (
    <Grid item xs={12} sm={large ? 12 : 6}>
      <Card style={{ height: '100%' }}>
        <Box
          padding={large ? '0 24px' : '32px 24px'}
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          rowGap={25}
          columnGap={60}
        >
          <Box paddingTop={large ? '32px' : 0}>
            <Typography fontSize={24} fontWeight={700}>
              {title}
            </Typography>
            <Typography sx={{ color: theme => theme.palette.text.secondary, mt: 8, fontSize: 16 }}>
              {synospis}
            </Typography>
          </Box>

          <Button
            width={isDownMd ? '100%' : '240px'}
            disabled={!onClick}
            onClick={onClick}
            style={{ marginBottom: large ? '32px' : 0 }}
          >
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
              padding: large ? '0px' : '10px 15px',
              gridColumnStart: { xs: 'unset', md: '2' }
            }}
          />
        </Box>
      </Card>
    </Grid>
  )
}
