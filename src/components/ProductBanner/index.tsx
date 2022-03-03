import { Box, Grid, Typography, styled } from '@mui/material'
import LogoText from 'components/LogoText'
import Image from 'components/Image'
import checkUrl from 'assets/images/check.png'
import { ReactComponent as DualInvestGuide } from 'assets/svg/dualInvestGuide.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import NumericalCard from 'components/Card/NumericalCard'

const StyledImg = styled(Box)(({ theme }) => ({
  svg: {
    marginBottom: 13,
    '& #dualInvestGuide': {
      zIndex: 2,
      '&:hover, :focus, :active': {
        opacity: 1,
        cursor: 'pointer'
      }
    },
    flexShrink: 1,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: '20px auto 0'
    }
  }
}))

export default function ProductBanner({
  title,
  val1,
  unit1,
  subVal1,
  val2,
  unit2,
  subVal2,
  checkpoints,
  img
}: {
  title: string
  val1: string
  unit1: string | JSX.Element
  subVal1: string
  val2: string
  unit2: string | JSX.Element
  subVal2: string
  checkpoints: string[]
  img?: JSX.Element
}) {
  const isDownMd = useBreakpoint('md')
  const isDownSm = useBreakpoint('sm')

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        width: '100%',
        background: theme => theme.palette.background.paper,
        padding: { xs: '32px 20px 20px', md: '40px', lg: '44px 61px' }
      }}
    >
      <Box
        sx={{ maxWidth: theme => ({ xs: '100%', md: theme.width.maxContent }) }}
        width="100%"
        display={{ xs: 'grid', sm: 'flex' }}
        justifyContent={{ sm: 'center', md: 'space-between' }}
        alignItems="center"
        gap={15}
      >
        <Box display="grid" gap={12}>
          <Typography component="h1" sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700 }}>
            {title}
          </Typography>
          <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 8, md: 32 }} paddingBottom={{ xs: 12, md: 30 }}>
            {checkpoints.map(point => (
              <LogoText
                key={point}
                logo={<Image src={checkUrl} />}
                text={<Typography sx={{ fontSize: { xs: 14, md: 18 }, opacity: 0.8 }}>{point}</Typography>}
              />
            ))}
          </Box>
          <Grid container spacing={{ xs: 8, md: 20 }}>
            <Grid item xs={12} md={6} height={{ xs: 76, md: 'auto' }}>
              <NumericalCard
                fontSize={isDownMd ? '20px' : undefined}
                width={isDownSm ? '100%' : isDownMd ? '320px' : '264px'}
                value={val1}
                unit={unit1}
                border
                height={isDownMd ? 76 : 'auto'}
                subValue={subVal1}
                gap={isDownMd ? '12px' : undefined}
              />
            </Grid>
            <Grid item xs={12} md={6} mt={{ xs: 8, md: 0 }}>
              <NumericalCard
                fontSize={isDownMd ? '20px' : undefined}
                width={isDownSm ? '100%' : isDownMd ? '320px' : '264px'}
                value={val2}
                unit={unit2}
                border
                subValue={subVal2}
                height={isDownMd ? 76 : 'auto'}
                gap={isDownMd ? '12px' : undefined}
              />
            </Grid>
          </Grid>
        </Box>
        <StyledImg> {img ? img : <DualInvestGuide />}</StyledImg>
      </Box>
    </Box>
  )
}
