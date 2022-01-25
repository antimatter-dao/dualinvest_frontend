import { Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import ProductCardHeader from 'components/ProductCardHeader'
import { OutlinedCard } from 'components/Card/Card'
import useBreakpoint from 'hooks/useBreakpoint'
import { Timer } from 'components/Timer'
import SwitchToggle from 'components/SwitchToggle'
import TextButton from 'components/Button/TextButton'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import { PRODUCT_TYPE_ROUTE } from 'components/Tabs/InvestTabs'

interface Props {
  logoCurSymbol: string
  title: string
  priceCurSymbol: string
  description: string
  account?: string | null
  vaultForm: React.ReactNode
  timer: number
  isRecurOpen: boolean
  onRecurOpen: () => void
  activeOrder: number | string
}

export default function VaultCard(props: Props) {
  const {
    logoCurSymbol,
    title,
    priceCurSymbol,
    description,
    account,
    vaultForm,
    timer,
    isRecurOpen,
    onRecurOpen,
    activeOrder
  } = props
  const isDownMd = useBreakpoint('md')
  const history = useHistory()

  const handleDetails = useCallback(() => {
    history.push(routes.accountTabType.replace(':tab', 'position').replace(':type', PRODUCT_TYPE_ROUTE.recurVault))
  }, [history])

  return (
    <Card>
      <Box padding="34px 29px 39px">
        <ProductCardHeader
          logoCurSymbol={logoCurSymbol}
          title={title}
          description={description}
          priceCurSymbol={priceCurSymbol}
        />
        <Box display={isDownMd ? 'grid' : 'flex'} width="100%" gap={isDownMd ? '40px' : '80px'} mt={10}>
          <Box width={'100%'}>{vaultForm}</Box>
          <OutlinedCard width={'100%'} style={{ margin: '12px 0' }}>
            <Box width={'100%'} padding="34px 22px 27px" display="flex" flexDirection={'column'} gap={46}>
              <Card gray>
                <Box padding="22px" display="grid" gap={30}>
                  <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
                    When you stop recurring, all your existing orders will not be taken into next cycle and you can
                    redeem your tokens once your existing orders expire.
                  </Typography>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} gap={15}>
                    <Typography fontWeight={700}>Recurring:</Typography>
                    <SwitchToggle checked={isRecurOpen} onChange={onRecurOpen} disabled={!account} />
                  </Box>
                </Box>
              </Card>
              <Box display="flex" flexDirection="column" gap={16}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16}>Order in progress</Typography>
                  <Box display="flex" alignItems="center" gap={5}>
                    <span style={{ textDecoration: 'none' }}> {activeOrder}</span>
                    <TextButton
                      primary
                      onClick={handleDetails}
                      style={{ textDecoration: 'underline', width: 'max-content' }}
                      disabled={!account}
                    >
                      Details
                    </TextButton>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16}>Next Order Due Time</Typography>
                  <Typography
                    component="div"
                    fontSize={16}
                    fontWeight={700}
                    sx={{ color: theme => theme.palette.text.secondary }}
                  >
                    <Timer timer={timer} />
                  </Typography>
                </Box>
              </Box>
            </Box>
          </OutlinedCard>
        </Box>
      </Box>
    </Card>
  )
}
