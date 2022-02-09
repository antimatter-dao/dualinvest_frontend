import { useMemo, useState, useCallback, ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Box, useTheme, styled } from '@mui/material'
import MgmtPage from 'components/MgmtPage'
import { routes } from 'constants/routes'
import { Subject } from 'components/MgmtPage/stableContent'
import TextButton from 'components/Button/TextButton'
import { vaultPolicyCall, vaultPolicyPut, valutPolicyTitle, vaultPolicyText } from 'components/MgmtPage/stableContent'
import VaultForm from './VaultForm'
import { useSingleRecurProcuct } from 'hooks/useRecurData'
import DualInvestChart from 'pages/DualInvestMgmt/Chart'

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

export default function RecurringValueMgmt() {
  const [investAmount, setInvestAmount] = useState('')

  const theme = useTheme()
  const { currency, type } = useParams<{ currency: string; type: string }>()
  const product = useSingleRecurProcuct(currency ?? '', type ?? '')

  const strikePrice = product?.strikePrice ?? '-'

  const returnOnInvestmentListItems = useMemo(() => {
    return [
      <>
        When the final settlement price ≥ {product?.strikePrice ?? '-'} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>
          (Subscription Amount * Strike Price) * [1 + (APY % * Period (days) / 365)]
        </span>
        .
      </>,
      <>
        When the settlement price &lt; {product?.strikePrice ?? '-'} USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>
          Subscription Amount * [1 + (APY% * Period (days) / 365)]
        </span>
        .
      </>,
      <>
        APY will be refreshed instantly, and Antimatter will use and lock in the latest APY when you successfully
        complete the subscription.
      </>
    ]
  }, [product?.strikePrice, theme.palette.text.primary])

  const chart = useMemo(() => {
    return (
      <DualInvestChart
        product={product}
        str1={`Settlement Price ≥ ${strikePrice} USDT, will be exercised`}
        str2={`Settlement Price < ${strikePrice} USDT, will not be exercised`}
      />
    )
  }, [product, strikePrice])

  const handleInput = useCallback((val: string) => {
    setInvestAmount(val)
  }, [])

  return (
    <>
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
      />
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
