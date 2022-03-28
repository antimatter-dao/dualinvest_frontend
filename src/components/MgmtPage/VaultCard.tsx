import { Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import ProductCardHeader from 'components/ProductCardHeader'
import useBreakpoint from 'hooks/useBreakpoint'
import Divider from 'components/Divider'
import Tabs from 'components/Tabs/Tabs'
import VaultForm from './VaultForm'
import { DefiProduct } from 'hooks/useDefiVault'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useState } from 'react'
import { Timer } from 'components/Timer'

export enum TYPE {
  invest,
  standard,
  instant
}

interface Props {
  title: string
  formData: { [key: string]: any }
  available?: string
  onInvestChange: (val: string) => void
  amount: string
  onWithdraw: () => void
  onInvest: () => void
  error: string
  product: DefiProduct | undefined
}

export default function VaultCard(props: Props) {
  const { title, formData, available, onInvestChange, amount, onWithdraw, onInvest, error, product } = props
  const [currentTab, setCurrentTab] = useState<TYPE>(0)
  const { chainId } = useActiveWeb3React()

  const isDownSm = useBreakpoint('md')
  const productChainId = product?.chainId
  const currencySymbol = product?.investCurrency ?? ''
  const disabled = !product || !amount || chainId !== product?.chainId

  const handleTabClick = useCallback(
    (val: number) => {
      setCurrentTab(val)
      onInvestChange('')
    },
    [onInvestChange]
  )

  return (
    <Card>
      <Box padding={{ xs: '24px 16px 25px', md: '34px 24px 48px' }}>
        <ProductCardHeader
          logoCurSymbol={product?.investCurrency}
          title={title}
          priceCurSymbol={product?.currency ?? ''}
          description={`Generates yield by running an automated ${
            product?.type === 'CALL' ? `${product?.currency ?? ''} covered call strategy` : `put selling strategy`
          }`}
        />

        <Box width={'100%'} mt={{ xs: 0, md: 30 }}>
          <Box mt={12} position="relative">
            <Typography
              position={{ xs: 'static', md: 'absolute' }}
              sx={{ top: 0, right: 0, height: 48 }}
              display="flex"
              alignItems={'center'}
              variant="inherit"
            >
              Countdown to the start:
              <Typography component={'span'} color="primary" fontWeight={700} variant="inherit" ml={5}>
                <Timer timer={product?.expiredAt ?? 0} />
              </Typography>
            </Typography>
            {isDownSm && <Divider sx={{ opacity: 0.1 }} />}
            <Tabs
              customCurrentTab={currentTab}
              customOnChange={handleTabClick}
              titles={['Invest', 'Standard Withdrawal', 'Instant Withdrawal']}
              tabPadding="12px 0px 12px 0px"
              contents={[
                <VaultForm
                  error={error}
                  key="invest"
                  type={'Invest'}
                  currencySymbol={currencySymbol}
                  available={available}
                  onChange={onInvestChange}
                  val={amount}
                  onClick={onInvest}
                  disabled={disabled}
                  productChainId={productChainId}
                  formData={formData}
                >
                  <Typography display="flex" alignItems={'center'} variant="inherit">
                    APY:
                    <Typography component={'span'} color="primary" fontWeight={700} variant="inherit" ml={5}>
                      {product?.apy ?? '-'}
                    </Typography>
                  </Typography>
                </VaultForm>,
                <VaultForm
                  key={TYPE.standard}
                  type={'Standard'}
                  val={amount}
                  onChange={onInvestChange}
                  currencySymbol={currencySymbol}
                  onClick={onWithdraw}
                  disabled={disabled}
                  productChainId={productChainId}
                  formData={formData}
                >
                  22
                </VaultForm>,
                <VaultForm
                  key={TYPE.instant}
                  type={'Instant'}
                  val={amount}
                  onChange={onInvestChange}
                  currencySymbol={currencySymbol}
                  onClick={onWithdraw}
                  disabled={disabled}
                  productChainId={productChainId}
                  formData={formData}
                  available={product?.instantBalance}
                >
                  <Typography display="flex" alignItems={'center'} variant="inherit">
                    Redeemable:
                    <Typography component={'span'} color="primary" fontWeight={700} variant="inherit" ml={5}>
                      {product?.apy ?? '-'}
                    </Typography>
                  </Typography>
                </VaultForm>
              ]}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
