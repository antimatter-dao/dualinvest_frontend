import { useMemo, useState, useCallback, ReactElement } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Typography, Box, useTheme, styled, Grid } from '@mui/material'
import MgmtPage from 'components/MgmtPage'
import { routes } from 'constants/routes'
import { Subject } from 'components/MgmtPage/stableContent'
import TextButton from 'components/Button/TextButton'
import { vaultPolicyCall, vaultPolicyPut, valutPolicyTitle, vaultPolicyText } from 'components/MgmtPage/stableContent'
import VaultForm from './VaultForm'
import DualInvestChart /*,{ PastAggrChart }*/ from 'pages/DualInvestMgmt/Chart'
import Card from 'components/Card/Card'
import dayjs from 'dayjs'
import useBreakpoint from 'hooks/useBreakpoint'
import { useSingleDefiVault } from 'hooks/useDefiVault'
import { PrevRecur } from 'utils/fetch/recur'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'

export const StyledUnorderList = styled('ul')(({ theme }) => ({
  paddingLeft: '14px',
  margin: '-20px 0 0',
  color: '#808080',
  '& li': {
    marginTop: 20,
    fontSize: 16,
    lineHeight: '20px'
  },
  '& li span': {
    color: '#252525'
  },
  '& li::marker': {
    color: theme.palette.primary.main
  }
}))

export default function DefiMgmt() {
  const [investAmount, setInvestAmount] = useState('')

  const theme = useTheme()
  const { currency, type, chainName } = useParams<{ currency: string; type: string; chainName: string }>()

  const product = useSingleDefiVault(chainName ?? '', currency ?? '', type ?? '')

  const prevDetails = undefined
  const isDownMd = useBreakpoint('md')
  const strikePrice = product?.strikePrice ?? '-'
  const isCall = type.toUpperCase() === 'CALL'

  const returnOnInvestmentListItems = useMemo(() => {
    return [
      <>
        When the final settlement price {isCall ? '≥' : '≤'} {product?.strikePrice ?? '-'} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>
          (Subscription Amount {isCall ? '*' : '/'} Strike Price) * [1 + (APY% / 365)]
        </span>
        .
      </>,
      <>
        When the settlement price {isCall ? '<' : '>'} {product?.strikePrice ?? '-'} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>Subscription Amount * [1 + (APY% / 365)]</span>.
      </>,
      <>
        APY will be refreshed instantly, and Antimatter will use and lock in the latest APY when you successfully
        complete the subscription.
      </>
    ]
  }, [isCall, product?.strikePrice, theme.palette.text.primary])

  const chart = useMemo(() => {
    return (
      <DualInvestChart
        product={product ?? undefined}
        str1={`Settlement Price ${isCall ? '≥' : '≤'} ${strikePrice} USDT, will be exercised`}
        str2={`Settlement Price ${isCall ? '<' : '>'} ${strikePrice} USDT, will not be exercised`}
      />
    )
  }, [isCall, product, strikePrice])

  const handleInput = useCallback((val: string) => {
    setInvestAmount(val)
  }, [])

  // const chart2 = useMemo(() => {
  //   return <PastAggrChart />
  //   return null
  // }, [])
  return (
    <>
      {product === null ? (
        <Box
          position="fixed"
          top={{ xs: theme.height.mobileHeader, md: theme.height.header }}
          left={0}
          width={'100%'}
          height={{
            xs: `calc(100vh - ${theme.height.mobileHeader})`,
            md: `calc(100vh - ${theme.height.header})`
          }}
          padding={isDownMd ? '24px 24px 28px' : '27px 24px'}
          sx={{ background: '#ffffff' }}
        >
          <Box
            component={NavLink}
            to={routes.defiVault}
            zIndex={2}
            style={{ textDecoration: 'none', display: 'block', width: 'max-content' }}
          >
            <ArrowLeft />
            <Typography component="span" color={theme.bgColor.bg1} fontSize={{ xs: 12, md: 14 }} ml={16}>
              Go Back
            </Typography>
          </Box>
          <Box width="100%" height="100%" display="flex" justifyContent={'center'} alignItems="center">
            Product Not Available
          </Box>
        </Box>
      ) : (
        <MgmtPage
          graphTitle="Current Subscription Status"
          showFaq={false}
          backLink={routes.defiVault}
          pageTitle={
            product?.type === 'CALL'
              ? `${product?.currency ?? ''} Covered Call Recurring Strategy`
              : `${product?.currency ?? ''} Put Selling Recurring Strategy`
          }
          product={product ?? undefined}
          subject={Subject.RecurringVault}
          subscribeForm={
            <RecurringPolicy
              type={product?.type.toLocaleLowerCase() === 'call' ? 'call' : 'put'}
              currencySymbol={product?.currency ?? '-'}
            />
          }
          returnOnInvestmentListItems={returnOnInvestmentListItems}
          vaultForm={<VaultForm product={product} setAmount={handleInput} amount={investAmount} />}
          chart={chart}
        >
          <Grid xs={12} md={4} item>
            <PrevCycleStats prevDetails={prevDetails} />
          </Grid>
          {!isDownMd && (
            <Grid xs={12} md={8} item>
              <Card style={{ height: '100%' }}>
                <Box height="100%" width="100%" display="flex" alignItems={'center'} padding="24px">
                  <Typography sx={{ margin: 'auto auto' }} align="center">
                    Past aggregate earnings graph <br />
                    Coming soon...
                  </Typography>
                </Box>
              </Card>
            </Grid>
          )}
        </MgmtPage>
      )}
    </>
  )
}

function RecurringPolicy({ type, currencySymbol }: { type: 'call' | 'put'; currencySymbol: string }) {
  const [curIdx, setCurIdx] = useState(0)
  const policy = type === 'call' ? vaultPolicyCall : vaultPolicyPut
  const Text = vaultPolicyText[type]

  const handlePrev = useCallback(() => {
    setCurIdx(preIdx => {
      return preIdx === 0 ? 0 : preIdx - 1
    })
  }, [])

  const handleNext = useCallback(() => {
    setCurIdx(preIdx => {
      return preIdx === policy.length - 1 ? policy.length - 1 : preIdx + 1
    })
  }, [policy.length])

  return (
    <Box display="grid" gap="19px" padding="33px 24px">
      <Typography fontSize={24} fontWeight={700}>
        Recurring Policy
      </Typography>
      <StyledUnorderList>
        <Text currencySymbol={currencySymbol} />
      </StyledUnorderList>
      <Box position="relative">
        <Box width="100%" display="flex" justifyContent="space-between" position="absolute" top="50%">
          <TextButton onClick={handlePrev} disabled={curIdx === 0} style={{ '&:disabled': { opacity: 0 } }}>
            <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                opacity="0.4"
                d="M10.4844 17.9707L1.99909 9.48542L10.4844 1.00014"
                stroke="black"
                strokeWidth="1.6"
              />
            </svg>
          </TextButton>
          <TextButton
            onClick={handleNext}
            disabled={curIdx === policy.length - 1}
            style={{ '&:disabled': { opacity: 0 } }}
          >
            <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M0.828125 1L9.31341 9.48528L0.828125 17.9706" stroke="black" strokeWidth="1.6" />
            </svg>
          </TextButton>
        </Box>
        <Typography fontWeight={700} fontSize={14} color="primary">
          {valutPolicyTitle[curIdx]}
        </Typography>
        {<RecurringPolicyPage img={policy[curIdx].img} text={policy[curIdx].text} />}
      </Box>
      <Box display="flex" gap="5px" margin="10px auto 0">
        {policy.map((item, idx) => {
          const active = curIdx === idx
          return (
            <div
              key={idx}
              style={{
                height: 3,
                width: active ? 24 : 6,
                backgroundColor: active ? '#31B047' : '#C4C4C4',
                transition: '.5s',
                borderRadius: 3
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

function RecurringPolicyPage({ img, text }: { img: ReactElement<any, any>; text: string }) {
  return (
    <Box display="flex" gap="12px" flexDirection="column" justifyContent={'space-between'} alignItems="center">
      <div />
      <Box
        sx={{ border: '1px solid #25252510', borderRadius: 1 }}
        padding="15px"
        width="calc(100% - 34px)"
        display="grid"
        justifyItems={'center'}
        height={210}
        gap={8}
      >
        <Box alignItems="center" display="flex">
          {img}
        </Box>

        <Typography sx={{ color: '#00000060' }} fontWeight={400} fontSize={12}>
          {text}
        </Typography>
      </Box>
    </Box>
  )
}

function PrevCycleStats({ prevDetails }: { prevDetails: PrevRecur | undefined }) {
  const theme = useTheme()
  const data = useMemo(
    () => ({
      ['APY']: prevDetails?.apy ?? '-',
      ['Strike Price']: `${prevDetails?.strikePrice ?? '-'} USDT`,
      ['Executed Price']: `${prevDetails?.deliveryPrice ?? '-'} USDT`,
      ['Status']: prevDetails?.status ?? '-',
      ['Your P&L']: prevDetails?.pnl ?? '-',
      ['Date']: prevDetails
        ? `From ${dayjs(prevDetails.ts).format('MMM DD, YYYY')} to ${dayjs(prevDetails.expiredAt).format(
            'MMM DD, YYYY'
          )}`
        : '-'
    }),
    [prevDetails]
  )
  return (
    <Card width={'100%'}>
      <Box display="flex" gap="21px" padding="28px" flexDirection="column" alignItems={'stretch'}>
        <Typography fontSize={24} fontWeight={700}>
          Previous Cycle Statistics
        </Typography>

        {Object.keys(data).map((key, idx) => (
          <Box key={idx} display="flex" justifyContent={'space-between'}>
            <Typography fontSize={16} sx={{ opacity: 0.8 }}>
              {key}
            </Typography>

            <Typography
              fontWeight={key === 'APY' || (key === 'Status' && data.Status === 'Exercised') ? 400 : 500}
              color={
                key === 'APY' || (key === 'Status' && data.Status === 'Exercised')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary
              }
            >
              {data[key as keyof typeof data]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
