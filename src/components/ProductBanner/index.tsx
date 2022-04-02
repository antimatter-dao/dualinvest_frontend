import { Box, Grid, Typography, styled } from '@mui/material'
import LogoText from 'components/LogoText'
import Image from 'components/Image'
import checkUrl from 'assets/images/check.png'
import { ReactComponent as DualInvestGuide } from 'assets/svg/dualInvestGuide.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import NumericalCard from 'components/Card/NumericalCard'
import AnimatedSvg from 'components/AnimatedSvg'
import { useCallback } from 'react'

const StyledImg = styled(Box)(({ theme }) => ({
  svg: {
    marginTop: 'auto',
    maxHeight: 280,
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
      margin: 'auto auto 0'
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
  imgFileName,
  svgMargin,
  startingGuide
}: {
  title: string | JSX.Element
  val1?: string
  unit1?: string | JSX.Element
  subVal1?: string
  val2?: string
  unit2?: string | JSX.Element
  subVal2?: string
  checkpoints: string[]
  imgFileName?: string
  svgMargin?: string
  startingGuide?: boolean
}) {
  const isDownMd = useBreakpoint('md')
  const isDownSm = useBreakpoint('sm')

  const startingGuideCallback = useCallback(() => {
    window.open('https://docs.antimatter.finance/antimatter-structured-product/dual-investment', '_blank')
  }, [])

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        width: '100%',
        height: { xs: 'auto', md: 340 },
        background: theme => theme.palette.background.paper,
        padding: { xs: '30px 20px 0px', md: '40px 40px 0', lg: '20px 61px 0' }
      }}
    >
      <Box
        sx={{ maxWidth: theme => ({ xs: '100%', md: theme.width.maxContent }) }}
        width="100%"
        display={{ xs: 'grid', sm: 'flex' }}
        justifyContent={{ sm: 'center', md: 'space-between' }}
        alignItems={'flex-end'}
        gap={15}
      >
        <Box display="grid" gap={12} margin="auto 0">
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
          {val1 && val2 && (
            <Grid container spacing={{ xs: 8, md: 20 }} marginBottom={{ xs: 20, md: 35 }}>
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
          )}
        </Box>

        {imgFileName ? (
          <StyledImg
            sx={{
              '& svg': {
                margin: isDownMd ? undefined : svgMargin
              }
            }}
          >
            <AnimatedSvg
              fileName={imgFileName}
              className={startingGuide ? 'starting_guide' : undefined}
              onClick={startingGuide ? startingGuideCallback : undefined}
              sx={
                startingGuide
                  ? {
                      ':hover': {
                        cursor: 'pointer',
                        '& #starting_guide': {
                          stroke: '#ffffff',
                          strokeWidth: 3
                        }
                      }
                    }
                  : undefined
              }
            />
          </StyledImg>
        ) : (
          <StyledImg
            sx={{
              marginBottom: val1 && val2 ? 13 : -6,
              height: 'max-content'
            }}
          >
            <DualInvestGuide />{' '}
          </StyledImg>
        )}
      </Box>
    </Box>
  )
}
