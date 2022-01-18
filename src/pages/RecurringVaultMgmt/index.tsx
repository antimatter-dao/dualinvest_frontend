import { useMemo, useState, useCallback, ReactElement } from 'react'
import { Typography, Box, useTheme, styled } from '@mui/material'
import MgmtPage from 'components/MgmtPage'
import { routes } from 'constants/routes'
import { Subject } from 'components/MgmtPage/stableContent'
import { feeRate } from 'constants/index'
import VaultConfirmModal from './VaultConfirmModal'
import TextButton from 'components/Button/TextButton'
import { vaultPolicyCall, vaultPolicyPut, valutPolicyTitle } from 'components/MgmtPage/stableContent'

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
  const theme = useTheme()

  const confirmData = useMemo(
    () => ({
      ['Platform service fee']: feeRate,
      ['Spot Price']: '59,000 USDT',
      ['APY']: '140.25%',
      ['Strike Price']: '62,800 USDT',
      ['Delivery Date']: '29 Oct 2021'
      // ['Spot Price']: product?.currentPrice ?? '-' + ' USDT',
      // ['APY']: product?.apy ? (+product.apy * 100).toFixed(2) + '%' : '- %',
      // ['Strike Price']: product?.strikePrice ?? '-' + ' USDT',
      // ['Delivery Date']: product ? dayjs(product.expiredAt).format('DD MMM YYYY') + ' 08:30:00 AM UTC' : '-'
    }),
    []
  )

  const returnOnInvestmentListItems = useMemo(() => {
    return [
      <>Start at 11-29 09:00.</>,
      <>
        If the BTC price can keep rising within 24 hours, you will receive a reward of up to{' '}
        <span style={{ color: theme.palette.text.primary }}>220.00 USDT</span>.
      </>,
      <>If the BTC price down in a certain range, it will be eliminated and your total income will be settled</>,
      <>
        If the first interval down, you will get&nbsp;
        <span style={{ color: theme.palette.text.primary }}>20 USDT</span> compensation
      </>
    ]
  }, [theme.palette.text.primary])

  return (
    <>
      <VaultConfirmModal confirmData={confirmData} />
      <MgmtPage
        showFaq={false}
        backLink={routes.recurringVault}
        product={undefined}
        subject={Subject.RecurringVault}
        chart={undefined}
        subscribeForm={<RecurringPolicy type="call" />}
        returnOnInvestmentListItems={returnOnInvestmentListItems}
        showVault={true}
      />
    </>
  )
}

function RecurringPolicy({ type }: { type: 'call' | 'put' }) {
  const [curIdx, setCurIdx] = useState(0)
  const policy = type === 'call' ? vaultPolicyCall : vaultPolicyPut

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
    <Box display="grid" gap="19px" padding="33px 29px">
      <Typography fontSize={24} fontWeight={700}>
        Recurring Policy
      </Typography>
      <StyledUnorderList>
        <li>
          Vault earns its BTC deposits by running a bullish strategy that automatically covers BTC on a weekly basis.
          The vault reinvests the earnings earned back into the strategy, effectively increasing the saver&apos;s
          returns over time.
        </li>
        <li>
          It is important to note that when the final result is exercised, we will settle in another currency and invest
          again in the settlement currency&apos;s vault.
        </li>
      </StyledUnorderList>
      <Box position="relative">
        <Box width="100%" display="flex" justifyContent="space-between" position="absolute" top="40%">
          <TextButton onClick={handlePrev} disabled={curIdx === 0} style={{ '&:disabled': { opacity: 0 } }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                opacity="0.6"
                d="M11.67 1.77L9.9 0L0 9.9L9.9 19.8L11.67 18.03L3.54 9.9L11.67 1.77Z"
                fill="#31B047"
              />
            </svg>
          </TextButton>
          <TextButton
            onClick={handleNext}
            disabled={curIdx === policy.length - 1}
            style={{ '&:disabled': { opacity: 0 } }}
          >
            <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.6" d="M0 2.12L7.88 10L0 17.88L2.12 20L12.12 10L2.12 0L0 2.12Z" fill="#31B047" />
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
    <Box
      display="flex"
      gap="12px"
      flexDirection="column"
      justifyContent={'space-between'}
      alignItems="center"
      height={200}
    >
      <div />
      <Box height="140px" display="flex" alignItems="center">
        {img}
      </Box>
      <Typography sx={{ color: '#00000060' }} fontWeight={600} fontSize={12} align="center">
        {text}
      </Typography>
    </Box>
  )
}
