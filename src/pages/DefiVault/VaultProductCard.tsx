import { Box, Typography } from '@mui/material'
import { Timer } from 'components/Timer'
import Button from 'components/Button/Button'
import { RecurProduct } from 'utils/fetch/recur'
import Spinner from 'components/Spinner'
import { toLocaleNumberString } from 'utils/toLocaleNumberString'
import { useRecurBalance } from 'hooks/useRecur'
import { CURRENCIES, SUPPORTED_CURRENCIES } from 'constants/currencies'
import { ChainsBgImgs, NETWORK_CHAIN_ID } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { SimpleProgress } from 'components/Progress'

export default function VaultProductCard({
  logoCurSymbol,
  title,
  description,
  onClick,
  color,
  product
}: {
  logoCurSymbol: string
  title: string
  description: string
  onClick: () => void
  color: string
  product: RecurProduct | undefined
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
        padding: '129px 33px 33px',
        width: '100%'
      }}
    >
      <Box position="absolute" left={35} top={-110}>
        {ChainsBgImgs[56]}
      </Box>

      <CurrencyLogo
        currency={SUPPORTED_CURRENCIES[logoCurSymbol]}
        size={'64px'}
        style={{ marginBottom: 20, zIndex: 2 }}
      />

      <TextCard text={title} subText={description} />

      {product ? (
        <>
          <Box display={'grid'} gap={21}>
            <TextCard color={color} text={product?.apy ?? '-'} subText="Current APY" />
            <Box display="flex" alignItems={'center'} justifyContent="space-between">
              <TextCard
                text={`${
                  autoLockedBalance === '-' ? '-' : toLocaleNumberString(autoLockedBalance)
                }  ${product?.investCurrency ?? '-'}`}
                subText="Your existing position"
              />

              <Button
                style={{ borderRadius: 40 }}
                width={'74px'}
                height="36px"
                backgroundColor={color}
                onClick={onClick}
              >
                Add
              </Button>
            </Box>
          </Box>
          <Box display="grid" gap={9}>
            <Typography fontSize={12} color="rgba(0,0,0,0.5)">
              Countdown to the start
            </Typography>
            <SimpleProgress val={50} total={100} hideValue width="100%" customColor={color} height={8} />
            <Typography fontSize={16} fontWeight={700}>
              <Timer timer={product?.expiredAt ?? 0} />
            </Typography>
          </Box>
        </>
      ) : (
        <Box margin={'60px auto'}>
          <Spinner size={60} />
        </Box>
      )}
    </Box>
  )
}

function TextCard({ color, text, subText }: { color?: string; text: string; subText: string }) {
  return (
    <Box display="grid" gap={6}>
      <Typography fontSize={24} fontWeight={700} color={color}>
        {text}
      </Typography>
      <Typography sx={{ color: 'rgba(0,0,0,0.5)' }} fontSize={12}>
        {subText}
      </Typography>
    </Box>
  )
}
