import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Typography, Grid, styled } from '@mui/material'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import theme from 'theme'
import Card, { OutlinedCard } from 'components/Card/Card'
import Divider from 'components/Divider'
// import Spinner from 'components/Spinner'
import useBreakpoint from 'hooks/useBreakpoint'
import { RiskStatement, FAQ, Subject } from './stableContent'
// import { useSuccessImage } from 'hooks/useSuccessImage'

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

interface Props {
  showFaq?: boolean
  backLink: string
  product: any
  pageTitle?: string
  chart: React.ReactNode
  chart2?: React.ReactNode
  subject: Subject
  type?: string
  subscribeForm: React.ReactNode
  returnOnInvestmentListItems: React.ReactNode[]
  vaultForm?: React.ReactNode
  children?: React.ReactNode
  graphTitle: string
}

export default function MgmtPage(props: Props) {
  const {
    backLink,
    // product,
    pageTitle,
    chart,
    subject,
    type,
    subscribeForm,
    showFaq = true,
    returnOnInvestmentListItems,
    vaultForm,
    children,
    graphTitle
  } = props

  const isDownMd = useBreakpoint('md')

  const returnOnInvestment = useMemo(() => {
    return (
      <div>
        <Typography fontSize={16} color={theme.palette.text.primary}>
          Return on investment:
        </Typography>
        <StyledUnorderList>
          {returnOnInvestmentListItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </StyledUnorderList>
      </div>
    )
  }, [returnOnInvestmentListItems])

  return (
    <>
      <Box
        display="grid"
        width="100%"
        alignContent="flex-start"
        marginBottom="auto"
        justifyItems="center"
        padding={{ xs: '24px 20px', md: 0 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: isDownMd ? theme.palette.background.default : theme.palette.background.paper,
            padding: isDownMd ? '0 0 28px 0' : '27px 0'
          }}
        >
          <Box maxWidth={theme.width.maxContent} width="100%">
            <NavLink to={backLink} style={{ textDecoration: 'none' }}>
              <ArrowLeft />
              <Typography component="span" color={theme.bgColor.bg1} fontSize={{ xs: 12, md: 14 }} ml={16}>
                Go Back
              </Typography>
            </NavLink>
          </Box>
        </Box>

        <Box padding={isDownMd || vaultForm ? 0 : '60px 0'} sx={{ maxWidth: theme.width.maxContent }} width="100%">
          <Box mb={isDownMd ? 24 : 60} display="flex" gap={8} flexDirection={isDownMd ? 'column' : 'row'}>
            {pageTitle && (
              <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={700}>
                {pageTitle}
              </Typography>
            )}
            {subject === Subject.DualInvest && (
              <Typography fontSize={{ xs: 24, md: 44 }} fontWeight={400} component="span">
                [{type === 'CALL' ? 'upward' : 'down'} exercise]
              </Typography>
            )}
          </Box>

          <Grid container spacing={20}>
            {vaultForm && (
              <Grid xs={12} item>
                {vaultForm}
              </Grid>
            )}
            <Grid xs={12} md={4} item position="relative">
              <Card style={{ height: '100%' }}>{subscribeForm}</Card>
            </Grid>

            <Grid xs={12} md={8} item>
              <Card style={{ height: '100%' }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  maxWidth="100%"
                  height="100%"
                  width="100%"
                  padding="32px 24px"
                >
                  <Box
                    display="flex"
                    justifyContent={isDownMd ? 'flex-start' : 'space-between'}
                    flexDirection={isDownMd ? 'column' : 'row'}
                    gap={18}
                  >
                    <Typography fontSize={{ xs: 20, md: 24 }} fontWeight={700}>
                      {graphTitle}
                    </Typography>
                    <Box display="flex" gap={24}>
                      <Box display="flex" alignItems="center" gap={8}>
                        <Box height={10} width={10} borderRadius="50%" bgcolor="#18A0FB" />
                        <Typography fontSize={12} color="#18A0FB">
                          Spot Price
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={8}>
                        <Box height={10} width={10} borderRadius="50%" bgcolor="#F0B90B" />
                        <Typography fontSize={12} color="#F0B90B">
                          Strike Price
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ maxWidth: '100vw', height: '100%', flexGrow: 1 }} mt={20}>
                    <Box
                      maxHeight="100%"
                      height="100%"
                      gap={0}
                      display={{ xs: 'grid', md: 'flex', maxWidth: 'calc(100vw - 100px)' }}
                    >
                      {chart}
                    </Box>
                  </Box>
                  {isDownMd ? (
                    <Box>
                      <Divider extension={24} sx={{ opacity: 0.1, marginBottom: 20 }} />
                      {returnOnInvestment}
                    </Box>
                  ) : (
                    <OutlinedCard padding="16px 20px">{returnOnInvestment}</OutlinedCard>
                  )}
                </Box>
              </Card>
            </Grid>

            {children && <>{children}</>}

            <Grid xs={12} item>
              <Card style={{ height: '100%' }}>
                <RiskStatement subject={subject} />
              </Card>
            </Grid>

            {showFaq && (
              <Grid xs={12} item>
                <Card style={{ height: '100%' }} padding="32px 24px">
                  <FAQ subject={subject} />
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  )
}
