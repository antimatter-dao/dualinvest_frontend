import { useMemo, useState, useCallback, ReactElement, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Box, useTheme, styled, Grid } from '@mui/material'
import MgmtPage from 'components/MgmtPage'
import { routes } from 'constants/routes'
import { Subject } from 'components/MgmtPage/stableContent'
import TextButton from 'components/Button/TextButton'
import { vaultPolicyCall, vaultPolicyPut, valutPolicyTitle, vaultPolicyText } from 'components/MgmtPage/stableContent'
import VaultForm from './VaultForm'
import { useLastCycleRecurDetails, useSingleRecurProcuct } from 'hooks/useRecurData'
import DualInvestChart /*,{ PastAggrChart }*/ from 'pages/DualInvestMgmt/Chart'
import Card from 'components/Card/Card'
import { CURRENCIES } from 'constants/currencies'
import { PrevRecur } from 'utils/fetch/recur'
import dayjs from 'dayjs'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChainListMap, NETWORK_CHAIN_ID } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import SwitchChainModal from 'components/Modal/SwitchChainModal'

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

export default function RecurringVaultMgmt() {
  const { chainId } = useActiveWeb3React()

  const [switchChainModalOpen, setSwitchChainModalOpen] = useState(chainId !== NETWORK_CHAIN_ID)
  const [investAmount, setInvestAmount] = useState('')

  const theme = useTheme()
  const { currency, type } = useParams<{ currency: string; type: string }>()
  const product = useSingleRecurProcuct(currency ?? '', type ?? '')
  const prevDetails = useLastCycleRecurDetails(
    product?.investCurrency ? CURRENCIES[NETWORK_CHAIN_ID][product.investCurrency]?.address : undefined,
    product?.currency ? CURRENCIES[NETWORK_CHAIN_ID][product.currency]?.address : undefined
  )
  const isDownMd = useBreakpoint('md')
  const strikePrice = product?.strikePrice ?? '-'
  const isCall = product?.type === 'CALL'

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

  useEffect(() => {
    if (chainId === NETWORK_CHAIN_ID) {
      setSwitchChainModalOpen(false)
    }
  }, [chainId])

  const chart = useMemo(() => {
    return (
      <DualInvestChart
        product={product}
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
      <SwitchChainModal
        customOnDismiss={() => setSwitchChainModalOpen(false)}
        customIsOpen={switchChainModalOpen}
        fromChain={ChainListMap[chainId ?? NETWORK_CHAIN_ID]}
        toChain={ChainListMap[NETWORK_CHAIN_ID]}
      >
        Product only available on {ChainListMap[NETWORK_CHAIN_ID].name}, please switch to corresponding chain
      </SwitchChainModal>
      <MgmtPage
        graphTitle="Current Subscription Status"
        showFaq={false}
        backLink={routes.recurringVault}
        product={product}
        subject={Subject.RecurringVault}
        subscribeForm={
          <RecurringPolicy
            type={product?.type.toLocaleLowerCase() === 'call' ? 'call' : 'put'}
            currencySymbol={product?.currency ?? '-'}
          />
        }
        returnOnInvestmentListItems={returnOnInvestmentListItems}
        vaultForm={<VaultForm product={product} setInvestAmount={handleInput} investAmount={investAmount} />}
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
              {/* <Box
              maxHeight="100%"
              height="100%"
              gap={0}
              display={{ xs: 'grid', md: 'flex', maxWidth: 'calc(100vw - 100px)' }}
              flexDirection={'column'}
              padding={'32px 24px'}
            >
              <Typography fontSize={{ xs: 14, md: 16 }} paddingTop={18} paddingLeft={24} sx={{ opacity: 0.5 }}>
                Past Aggregate Earnings (Platform)
              </Typography>
              <Box
                display="flex"
                justifyContent={isDownMd ? 'flex-start' : 'space-between'}
                flexDirection={isDownMd ? 'column' : 'row'}
                alignItems="center"
                gap={18}
              >
                <Typography
                  component="div"
                  display="flex"
                  alignItems="baseline"
                  fontSize={{ xs: 40, md: 44 }}
                  paddingTop={13}
                  paddingLeft={24}
                  fontWeight={700}
                >
                  82,890
                  <Typography sx={{ fontSize: 16, fontWeight: 700, ml: 4, lineHeight: 1 }}>$</Typography>
                </Typography>
                <Box display="flex" flexDirection={'column'} gap={8}>
                  <Box display="flex" alignItems="center" gap={8}>
                    <Box height={10} width={10} borderRadius="50%" bgcolor="#ADDFB5" />
                    <Typography fontSize={14} color="#ADDFB5">
                      Unexercised
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={8}>
                    <Box height={10} width={10} borderRadius="50%" bgcolor="#E3E3E3" />
                    <Typography fontSize={14} color="#E3E3E3">
                      Exercised
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography fontSize={{ xs: 11, md: 13 }} paddingLeft={24}>
                Aug 26, 2021
              </Typography>
              {chart2}
            </Box> */}
            </Card>
          </Grid>
        )}
      </MgmtPage>
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
