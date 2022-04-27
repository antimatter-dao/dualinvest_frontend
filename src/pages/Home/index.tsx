import { Box, Grid, Typography, styled, useTheme } from '@mui/material'
import { useHistory } from 'react-router-dom'
import LogoText from 'components/LogoText'
import checkUrl from 'assets/images/check.png'
import Image from 'components/Image'
import NumericalCard from 'components/Card/NumericalCard'
import Button from 'components/Button/Button'
import securityUrl from 'assets/images/security.png'
import highReturnUrl from 'assets/images/high_return.png'
import flexibleUrl from 'assets/images/flexible.png'
import DualPlusUrl from 'assets/svg/home_dual_plus.svg'
import SaddleOptionUrl from 'assets/svg/home_saddle_option.svg'
import TieredOptionUrl from 'assets/svg/home_tiered_option.svg'
// import recurringVaultUrl from 'assets/svg/home_recur.svg'
import defiVaultUrl from 'assets/svg/home_defi.svg'
import Card from 'components/Card/Card'
import { routes } from 'constants/routes'
import { useBindModal } from 'hooks/useReferralModal'
import { useHomeStatistics } from 'hooks/useStatistics'
import useBreakpoint from 'hooks/useBreakpoint'
import { PlayVideo } from 'components/PlayVideo'
import AnimatedSvg from 'components/AnimatedSvg'
import UsdtBlack from 'assets/svg/usdt_black.svg'
import { ChevronRight } from '@mui/icons-material'

const StyledHomeSvg = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  maxWidth: 487,
  marginBottom: -1,
  alignSelf: 'flex-end',
  [theme.breakpoints.down('md')]: {
    maxWidth: 'calc(100% - 80px)'
  }
}))

const StyledUsdtLogo = styled('img')(({ theme }) => ({
  height: 35,
  width: 35,
  position: 'absolute',
  zIndex: 2,
  right: 0,
  top: 5,
  transform: 'matrix(0.96, 0.22, -0.29, 0.97, 0, 0)',
  [theme.breakpoints.down('sm')]: {
    height: 25,
    width: 25
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
      // display="grid"
      // justifyItems={{ md: 'center' }}
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
          // height: { xs: 'auto', md: '360px' },
          background: theme => theme.palette.background.paper,
          padding: { xs: '32px 20px', md: '44px 61px 0' }
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
          <Box display="grid" gap={12} mb={{ xs: 32, md: 61 }}>
            <Typography
              component="h1"
              sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700, textAlign: { xs: 'center', md: 'left' } }}
            >
              Structured Products <PlayVideo />
            </Typography>
            <LogoText
              style={{ justifyContent: isDownMd ? 'center' : 'flex-start' }}
              logo={<Image src={checkUrl} />}
              text={
                <Typography
                  sx={{ fontSize: { xs: 14, md: 24 }, opacity: 0.8, textAlign: { xs: 'center', md: 'left' } }}
                >
                  Simple, safe, high-yield digital asset management
                </Typography>
              }
            />
            <Button
              width={'193px'}
              height="53px"
              style={{ margin: isDownMd ? '20px auto 0' : '48px 0 0' }}
              onClick={() => {
                history.push(routes.dualInvest)
              }}
            >
              Start Now
            </Button>
          </Box>

          {isDownMd ? (
            <Box
              mt={24}
              width="100%"
              pt={20}
              borderRadius="16px"
              border="1px solid rgba(0,0,0,0.1)"
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              <StyledHomeSvg>
                <AnimatedSvg fileName={'home'}></AnimatedSvg>
              </StyledHomeSvg>
            </Box>
          ) : (
            <StyledHomeSvg>
              <AnimatedSvg fileName={'home'}></AnimatedSvg>
            </StyledHomeSvg>
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
          <Grid item xs={12} md={6} position="relative">
            <StyledUsdtLogo src={UsdtBlack} />
            <NumericalCard
              width={'100%'}
              title={isDownMd ? undefined : 'Total Investment Amount'}
              value={totalInvest}
              fontSize={isDownMd ? '20px' : '44px'}
              unit="USDT"
              unitSize={isDownMd ? '12px' : '16px'}
              border
              subValue={isDownMd ? 'Total Investment Amount' : undefined}
              padding="24px"
            />
          </Grid>
          <Grid item xs={12} md={6} position="relative">
            <StyledUsdtLogo src={UsdtBlack} />
            <NumericalCard
              width={'100%'}
              title={isDownMd ? undefined : 'Amount of Investment in Progress'}
              value={totalProgress}
              fontSize={isDownMd ? '20px' : '44px'}
              unit="USDT"
              unitSize={isDownMd ? '12px' : '16px'}
              border
              subValue={isDownMd ? 'Amount of Investment in Progress' : undefined}
              padding="24px"
            />
          </Grid>
        </Grid>

        <Card>
          <Box padding={{ xs: '40px 0 80px', md: '40px 0 100px' }} display="grid" gap={{ xs: 77, md: 130 }}>
            <ProductCard
              large
              imgHeight={isDownMd ? 300 : 420}
              contentMargin={'0 0 60px'}
              imgTitle={'home_dualInvest'}
              title="Dual Investment"
              synospis={`Earn on both ups and downs within 
a fluctuation range`}
              onClick={() => {
                history.push(routes.dualInvest)
              }}
            />
            <ProductCard
              large
              actionText="Start Now"
              contentMargin={'0 0 50px 0'}
              imgUrl={defiVaultUrl}
              title="Defi Option Vault"
              synospis={`Automatic management of funds, cyclic compound interest.
Earn yield on your idle assets`}
              onClick={() => {
                window.location.href = 'https://dov.antimatter.finance/#/defi'
              }}
            />
            <Box
              padding={{ xs: '0 24px', md: '0 60px' }}
              display={'flex'}
              flexDirection={{ xs: 'column-reverse', md: 'row' }}
              mb={{ md: -20 }}
              sx={{
                alignItems: 'center',
                overflow: 'hidden',
                background: theme => theme.palette.background.default,
                position: 'relative',
                '&:before': {
                  content: "''",
                  width: '100%',
                  height: '100%',
                  background: '#ffffff',
                  opacity: 0.5,
                  zIndex: 3,
                  position: 'absolute',
                  top: 0,
                  left: 0
                }
              }}
            >
              <Box
                maxHeight="315px"
                sx={{
                  marginRight: isDownMd ? '0' : 'auto',
                  height: '315px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Image src={DualPlusUrl} />
              </Box>
              <Box width={isDownMd ? '100%' : undefined}>
                <ProductCard
                  grayButton
                  contentMargin={isDownMd ? '60px 0 20px' : '0'}
                  large
                  title="Dual Investment Plus"
                  synospis={`Dual Investment standard
+ advanced settings`}
                />
              </Box>
            </Box>

            {/* <ProductCard
              large
              grayButton
              actionText="Explore"
              contentMargin={'0 0 50px 0'}
              imgUrl={recurringVaultUrl}
              title="Recurring Strategy"
              synospis={`Automatic management of funds, cyclic compound interest.
Earn yield on your idle assets`}
              onClick={() => {
                history.push(routes.defiVault)
              }}
            /> */}

            <Box display="grid" gap={{ xs: 24, md: 40 }} padding={{ xs: '0 24px', md: '0 60px' }}>
              <Typography fontSize={36} fontWeight={500}>
                Chain Option
              </Typography>
              <Grid container spacing={{ xs: 50, md: 80 }}>
                <ProductCard
                  grayButton
                  imgUrl={SaddleOptionUrl}
                  title="Saddle Options"
                  synospis={`Suitable to buy when the price
will fluctuate for a period of time`}
                  // onClick={() => {
                  //   history.push(routes.chainOptionTyped.replace(':type', 'saddle'))
                  // }}
                />
                <ProductCard
                  grayButton
                  imgUrl={TieredOptionUrl}
                  title="Tiered Options"
                  synospis={`Suitable for buying when the price
will fluctuate for a period of time`}
                  // onClick={() => {
                  //   history.push(routes.chainOptionTyped.replace(':type', 'tiered'))
                  // }}
                />
              </Grid>
            </Box>
          </Box>
        </Card>
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
  imgTitle,
  title,
  synospis,
  actionText,
  onClick,
  large,
  grayButton,
  imgHeight,
  imgUrl,
  contentMargin
}: {
  imgTitle?: string
  title: string
  synospis: string
  actionText?: string
  onClick?: () => void
  large?: boolean
  grayButton?: boolean
  imgHeight?: number
  imgUrl?: string
  contentMargin?: string
}) {
  const isDownMd = useBreakpoint('md')
  const isDownSm = useBreakpoint('sm')
  const theme = useTheme()
  return (
    <Grid item xs={12} sm={large ? 12 : 6} padding={large ? { xs: '0 24px', md: '0 60px' } : 0}>
      <Box display={{ xs: 'grid', md: 'flex' }} gap={large ? 0 : 60} position="relative">
        <Box
          position="relative"
          display="flex"
          flexDirection={'column'}
          justifyContent="center"
          margin={contentMargin ?? 0}
        >
          <Typography fontSize={large ? 36 : 24} fontWeight={500}>
            {title}
          </Typography>
          <Typography
            sx={{ color: theme.palette.text.secondary, mt: 8, fontSize: 16, zIndex: 2 }}
            whiteSpace="pre-wrap"
            textAlign={'left'}
            mb={imgHeight && !isDownMd ? 70 : 40}
          >
            {synospis}
          </Typography>
          <Button
            width={isDownSm ? '100%' : '156px'}
            disabled={!onClick}
            onClick={onClick}
            height="53px"
            style={
              grayButton
                ? {
                    zIndex: 2,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    '&:hover': {
                      color: '#ffffff',
                      backgroundColor: theme.palette.primary.main
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary
                    }
                  }
                : { zIndex: 2 }
            }
          >
            {!onClick ? 'Coming soon...' : actionText ?? 'Start Now'}
            {actionText === 'Explore' && <ChevronRight />}
          </Button>
        </Box>

        {imgTitle && (
          <Box
            margin={isDownMd ? '0 auto' : '0'}
            sx={{
              opacity: !onClick ? 0.5 : 1,
              marginLeft: 'auto',
              height: imgHeight ?? '200px',
              maxHeight: 385,
              padding: large ? '0px' : '10px 15px',
              display: 'flex',
              alignItems: 'flex-end'
            }}
          >
            <AnimatedSvg fileName={imgTitle} />
          </Box>
        )}
        {imgUrl && (
          <img
            src={imgUrl}
            style={{
              position: isDownMd ? 'static' : 'absolute',
              right: 0,
              bottom: 0,
              maxWidth: '100%',
              margin: isDownMd ? '0 auto' : 'auto auto 0',
              opacity: !onClick ? 0.5 : 1,
              height: imgHeight ?? '200px',
              padding: 0
            }}
          ></img>
        )}
      </Box>
    </Grid>
  )
}
