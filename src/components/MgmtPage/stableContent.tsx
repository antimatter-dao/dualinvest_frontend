import { useState, useMemo } from 'react'
import { Box, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as RiskStatementIcon } from 'assets/svg/risk_statement.svg'
import Accordion from 'components/Accordion'
import { ReactComponent as Faq } from 'assets/svg/faq.svg'
import { ReactComponent as Put1 } from 'assets/svg/recurPolicy/put1.svg'
import { ReactComponent as Put2 } from 'assets/svg/recurPolicy/put2.svg'
import { ReactComponent as Call1 } from 'assets/svg/recurPolicy/call1.svg'
import { ReactComponent as Call2 } from 'assets/svg/recurPolicy/call2.svg'
import { ReactComponent as Img3 } from 'assets/svg/recurPolicy/3.svg'

export enum Subject {
  DualInvest = 'DualInvest',
  ChainOption = 'ChainOption',
  RecurringVault = 'RecurringVault'
}

const StyledOrderList = styled('ol')(({ theme }) => ({
  display: 'block',
  listStyle: 'none',
  counterReset: 'counterReset',
  position: 'relative',
  marginBlockEnd: '0px',
  paddingLeft: 36,
  [theme.breakpoints.up('sm')]: {
    paddingRight: `calc( 100vw * 0.2 )`
  },
  '& li': {
    paddingBottom: '24px',
    paddingLeft: '12px',
    marginLeft: '12px'
  },
  '& li:before': {
    counterIncrement: 'counterReset',
    content: 'counter(counterReset)',
    color: theme.palette.primary.main,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1px solid #31B047',
    float: 'left',
    textAlign: 'center',
    marginLeft: '24px',
    position: 'absolute',
    left: '-1px'
  },
  [theme.breakpoints.down('md')]: {
    padding: '0px 0px 0px 36px'
  }
}))

const AccordionDetailText = styled(Box)({
  opacity: 0.5,
  display: 'grid',
  gap: 8,
  '& p': {
    margin: 0
  }
})

export function RiskStatement({ subject }: { subject: Subject }) {
  const theme = useTheme()
  const riskStatementListItems = useMemo(() => {
    const listItems = {
      [Subject.DualInvest]: [
        'This product is a non-principal-guaranteed wealth management product. Market fluctuations may result in a loss of principal. Please invest with caution.',
        'The investment amount is calculated in real time with the market, please refer to the actual purchase transaction.',
        'The annualized rate of return changes in real time with the market, please refer to the actual rate of return of the purchase transaction.',
        'The average spot price of the last 30 minutes at 12:00 (UTC) on the delivery date will be used as the settlement price.',
        'Early redemption is not supported, and users can only get rewards after the expiry date.',
        'After the product is purchased, you can view it on my currency holding page, and the payment will be automatically issued to the Account after the delivery.'
      ],
      [Subject.ChainOption]: [
        'This product is a non-principal-guaranteed wealth management product. Market fluctuations may result in a loss of principal. Please invest with caution.',
        'The investment amount is calculated in real time with the market, please refer to the actual purchase transaction.',
        'The annualized rate of return changes in real time with the market, please refer to the actual rate of return of the purchase transaction.',
        'The average spot price of the last 30 minutes at 12:00 (UTC+8) on the delivery date will be used as the settlement price.',
        'Early redemption is not supported, and users can only get rewards after the expiry date.',
        'After the product is purchased, you can check the operation status on the position page.'
      ],
      [Subject.RecurringVault]: [
        'This product is a non-principal-guaranteed wealth management product. Market fluctuations may result in a loss of principal. Please invest with caution.',
        'The investment amount is calculated in real time with the market, please refer to the actual purchase transaction.',
        'The annualized rate of return changes in real time with the market, please refer to the actual rate of return of the purchase transaction.',
        'The average spot price of the last 30 minutes at 12:00 (UTC+8) on the delivery date will be used as the settlement price.',
        'Early redemption is not supported, and users can only get rewards after the expiry date.',
        <Typography fontSize={16} key={1}>
          After the product is purchased, you can view it on my currency{' '}
          <span style={{ color: theme.palette.primary.main }}>holding page</span>, and the payment will be automatically
          issued to the Account after the delivery.
        </Typography>
      ]
    }

    return listItems[subject]
  }, [subject, theme.palette.primary.main])

  return (
    <Box padding="32px 24px" display="grid" gap={29}>
      <Box display="flex" alignItems="center" gap={11.68} width="100%">
        <RiskStatementIcon />
        <Typography fontSize={{ xs: 20, md: 24 }} fontWeight={700}>
          Risk statement
        </Typography>
      </Box>
      <Box fontSize={{ xs: 14, md: 16 }} marginLeft="-24px">
        <StyledOrderList>
          {riskStatementListItems.map((li, idx) => (
            <li key={idx}>{li}</li>
          ))}
        </StyledOrderList>
      </Box>
    </Box>
  )
}

export function FAQ({ subject }: { subject: Subject }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  // const node = useRef<any>()
  // useOnClickOutside(node, () => setExpanded(null))

  const FAQItems = useMemo(() => {
    const items = {
      [Subject.DualInvest]: [
        {
          summary: 'What is Dual Investment?',
          details: (
            <AccordionDetailText sx={{ fontSize: { xs: 14, md: 16 } }}>
              Antimatter Dual Investment is an advanced options derivative based on a decentralised protocol. The
              product has a &quot;market-neutral, returns guaranteed&quot; feature, where the yield is clear and fixed
              at the time of purchase, while the settlement currency is uncertain. At maturity, the settlement currency
              depends on the outcome of the settlement price at maturity compared to the strike price.
            </AccordionDetailText>
          )
        },
        {
          summary: 'How is my return calculated?',
          details: (
            <AccordionDetailText sx={{ fontSize: { xs: 14, md: 16 } }}>
              <p>
                When a product is &quot;exercised&quot;, the subscription amount and yields will be swapped at the
                strike price in the alternative currency.
              </p>
              <p>
                <b>Up-and-Exercised:</b> Yields = (Subscription Amount * Strike Price) * [1 + (APY % * Period (days) /
                365)]
              </p>
              <p>
                <b>Down-and-Exercised:</b> Yields = (Subscription Amount / Strike Price) * [1 + (APY % * Cycle (Days) /
                365)]
              </p>
              <p>
                When a subscription is &quot;unexercised&quot;, the subscription amount and yields will not be
                transferred into the alternative currency and the user will receive the currency they invested.
              </p>
              <p>
                <b>Yields</b> = Subscription Amount * [1 + (APY% * Period (days) / 365)]
              </p>
              <p>Yields will be automatically credited to the user&apos;s account within 24 hours of settlement.</p>
            </AccordionDetailText>
          )
        },
        {
          summary:
            'What are “Strike Price”, “Underlying Asset”, “Deposit Currency”, “Alternate Currency”, “Deposit Days”, and “Settlement Price”?',
          details: (
            <AccordionDetailText sx={{ fontSize: { xs: 14, md: 16 } }}>
              <p>
                <b>Strike Price</b> - A set price at which deposit currency will be converted into alternate currency if
                the product is exercised.
              </p>
              <p>
                <b>Underlying Asset</b> - An asset on which a Dual Investment product is based. For instance, if you are
                making reference to BTC spot price and BTC strike price, then the underlying asset is BTC.
              </p>
              <p>
                <b>Deposit Currency</b> - The currency you have used to subscribe to a Dual Investment product.
              </p>
              <p>
                <b>Alternate Currency</b> - The currency you will be receiving if the product is exercised.
              </p>
              <p>
                <b>Deposit Days</b> - A number of days remaining until the delivery date.
              </p>
              <p>
                <b>Settlement Price</b> - Average of the spot price in the last 30 minutes before 08:00 (UTC) on the
                delivery date. Settlement price and strike price determines whether a product is exercised or not.
              </p>
            </AccordionDetailText>
          )
        }
      ],
      [Subject.ChainOption]: [
        {
          summary: 'What is Chain-Type Option?',
          details: (
            <AccordionDetailText sx={{ fontSize: { xs: 14, md: 16 } }}>
              Antimatter Dual Investment is an advanced options derivative based on a decentralised protocol. The
              product has a &quot;market-neutral, returns guaranteed&quot; feature, where the yield is clear and fixed
              at the time of purchase, while the settlement currency is uncertain. At maturity, the settlement currency
              depends on the outcome of the settlement price at maturity compared to the strike price.
            </AccordionDetailText>
          )
        },
        {
          summary: 'How is my return calculated?',
          details: (
            <AccordionDetailText sx={{ fontSize: { xs: 14, md: 16 } }}>
              Antimatter Dual Investment is an advanced options derivative based on a decentralised protocol. The
              product has a &quot;market-neutral, returns guaranteed&quot; feature, where the yield is clear and fixed
              at the time of purchase, while the settlement currency is uncertain. At maturity, the settlement currency
              depends on the outcome of the settlement price at maturity compared to the strike price.
            </AccordionDetailText>
          )
        },
        {
          summary: 'Are the Strike Price and APY fixed?',
          details: (
            <AccordionDetailText sx={{ fontSize: { xs: 14, md: 16 } }}>
              Antimatter Dual Investment is an advanced options derivative based on a decentralised protocol. The
              product has a &quot;market-neutral, returns guaranteed&quot; feature, where the yield is clear and fixed
              at the time of purchase, while the settlement currency is uncertain. At maturity, the settlement currency
              depends on the outcome of the settlement price at maturity compared to the strike price.
            </AccordionDetailText>
          )
        },
        {
          summary: 'How can I view my orders?',
          details: (
            <AccordionDetailText sx={{ fontSize: { xs: 14, md: 16 } }}>
              Antimatter Dual Investment is an advanced options derivative based on a decentralised protocol. The
              product has a &quot;market-neutral, returns guaranteed&quot; feature, where the yield is clear and fixed
              at the time of purchase, while the settlement currency is uncertain. At maturity, the settlement currency
              depends on the outcome of the settlement price at maturity compared to the strike price.
            </AccordionDetailText>
          )
        }
      ],
      [Subject.RecurringVault]: []
    }

    return items[subject]
  }, [subject])

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={11.68} width="100%">
        <Faq />
        <Typography fontSize={{ xs: 20, md: 24 }} fontWeight={700}>
          FAQ
        </Typography>
      </Box>
      <Box mt={28}>
        {FAQItems.map(({ summary, details }, idx) => (
          <Accordion
            key={idx}
            summary={summary}
            details={details}
            expanded={expanded === idx}
            onChange={() => {
              if (expanded === idx) {
                setExpanded(null)
                return
              }
              setExpanded(idx)
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export const vaultPolicyCall = [
  {
    img: <Call1 />,
    text: 'The vault algorithmically selects the optimal strike price for the BTC call options.'
  },
  {
    img: <Call2 />,
    text:
      'Out of the price when the call option expires, according to whether the option is exercised, which currency is the settlement fund'
  },
  {
    img: <Img3 />,
    text:
      'Regardless of the settlement currency, we will again invest in the treasury of the settlement currency, no management, automatic compounding'
  }
]
export const vaultPolicyPut = [
  {
    img: <Put1 />,
    text: 'The vault algorithmically selects the optimal strike price for the BTC put options.'
  },
  {
    img: <Put2 />,
    text:
      'Regardless of the settlement currency, we will again invest in the treasury of the settlement currency, no management, automatic compounding'
  },
  {
    img: <Img3 />,
    text: 'The vault algorithmically selects the optimal strike price for the BTC call options.'
  }
]

export const valutPolicyTitle = ['Algorithmic Strike Selection', 'Two settlement results', 'Recurring Strategy']

export const vaultPolicyText: {
  call: React.FC<{ currencySymbol: string }>
  put: React.FC<{ currencySymbol: string }>
} = {
  call: function({ currencySymbol }: { currencySymbol: string }) {
    return (
      <>
        <li>
          Strategy earns its {currencySymbol} deposits by running a bullish strategy that automatically covers{' '}
          {currencySymbol} on a weekly basis. The vault reinvests the earnings earned back into the strategy,
          effectively increasing the saver&apos;s returns over time.
        </li>
        <li>
          It is important to note that when the final result is exercised, we will settle in another currency and invest
          again in the settlement currency&apos;s strategy.
        </li>
      </>
    )
  },
  put: function({ currencySymbol }: { currencySymbol: string }) {
    return (
      <>
        <li>
          Strategy earns its {currencySymbol} deposits by running a put strategy that automatically covers{' '}
          {currencySymbol} on a weekly basis. The strategy reinvests the earnings earned without further management,
          effectively increasing the saver&apos;s returns over time.
        </li>
        <li>
          It is important to note that when the final result is exercised, we will settle in another currency and invest
          again in the settlement currency&apos;s strategy.
        </li>
      </>
    )
  }
}
