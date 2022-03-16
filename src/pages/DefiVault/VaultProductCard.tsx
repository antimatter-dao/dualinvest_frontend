import { Box, Typography } from '@mui/material'
import { Timer } from 'components/Timer'
import Button from 'components/Button/Button'
import { RecurProduct } from 'utils/fetch/recur'
import Spinner from 'components/Spinner'
import { toLocaleNumberString } from 'utils/toLocaleNumberString'
import { useRecurBalance } from 'hooks/useRecur'
import { CURRENCIES, SUPPORTED_CURRENCIES } from 'constants/currencies'
import { ChainId, ChainsBgImgs, NETWORK_CHAIN_ID } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { SimpleProgress } from 'components/Progress'

export default function VaultProductCard({
  logoCurSymbol,
  title,
  description,
  onClick,
  color,
  product,
  onChain
}: {
  logoCurSymbol: string
  title: string
  description: string
  onClick: () => void
  color: string
  product: RecurProduct | undefined
  onChain: ChainId
}) {
  const { chainId } = useActiveWeb3React()
  const { autoLockedBalance } = useRecurBalance(
    CURRENCIES[chainId ?? NETWORK_CHAIN_ID][product?.currency ?? ''] ?? undefined,
    CURRENCIES[chainId ?? NETWORK_CHAIN_ID][product?.investCurrency ?? ''] ?? undefined
  )

  return (
    <Box
      display="grid"
      width="100%"
      gap={'32px'}
      margin={{ xs: '0px 20px' }}
      position="relative"
      overflow="hidden"
      sx={{
        border: '1px solid transparent',
        background: theme => theme.palette.background.paper,
        borderRadius: 2,
        padding: '36px 24px',
        width: '100%'
      }}
    >
      <Box position="absolute" right={-45} top={-75}>
        {ChainsBgImgs[onChain]}
      </Box>

      <CurrencyLogo
        currency={SUPPORTED_CURRENCIES[logoCurSymbol]}
        size={'80px'}
        style={{ marginBottom: 20, zIndex: 2 }}
      />

      <TextCard text={title} subText={description} maxWidth={240} />

      {product ? (
        <>
          <Box
            display={{ xs: 'flex', sm: 'grid', md: 'flex' }}
            gap={21}
            maxWidth={260}
            justifyContent={'space-between'}
          >
            <TextCard subTextBold color={color} text={product?.apy ?? '-'} subText="Current APY" />
            <Box display="flex" alignItems={'center'} justifyContent="space-between">
              <TextCard
                subTextBold
                text={`${
                  autoLockedBalance === '-' ? '-' : toLocaleNumberString(autoLockedBalance)
                }  ${product?.investCurrency ?? '-'}`}
                subText="Your existing position"
              />
            </Box>
          </Box>
          <Box display="grid" gap={9}>
            <SimpleProgress val={50} total={100} hideValue width="100%" customColor={color} height={8} />
            <Box display="flex" alignItems={'center'} justifyContent="space-between">
              <Typography fontSize={12} color="rgba(0,0,0,0.5)" fontWeight={500}>
                Countdown to the start
              </Typography>
              <Typography fontSize={12} fontWeight={700}>
                <Timer timer={product?.expiredAt ?? 0} />
              </Typography>{' '}
            </Box>
          </Box>
          <Button backgroundColor={color} onClick={onClick}>
            Add
          </Button>
        </>
      ) : (
        <Box margin={'60px auto'}>
          <Spinner size={60} />
        </Box>
      )}
    </Box>
  )
}

function TextCard({
  color,
  text,
  subText,
  maxWidth,
  subTextBold
}: {
  color?: string
  text: string
  subText: string
  maxWidth?: number
  subTextBold?: boolean
}) {
  return (
    <Box display="grid" gap={6} maxWidth={maxWidth}>
      <Typography fontSize={24} fontWeight={700} color={color}>
        {text}
      </Typography>
      <Typography sx={{ color: 'rgba(0,0,0,0.5)' }} fontSize={12} fontWeight={subTextBold ? 500 : 400}>
        {subText}
      </Typography>
    </Box>
  )
}
