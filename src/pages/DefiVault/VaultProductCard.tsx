import { Box, Typography } from '@mui/material'
// import { Timer } from 'components/Timer'
import Button from 'components/Button/Button'
import Spinner from 'components/Spinner'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import { ChainId } from 'constants/chain'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { SimpleProgress } from 'components/Progress'
import { DefiProduct } from 'hooks/useDefiVault'
import { ChainListMap } from 'constants/chain'
import Image from 'components/Image'

export default function VaultProductCard({
  title,
  description,
  onClick,
  color,
  product,
  onChain
}: {
  title: string
  description: string
  onClick: () => void
  color: string
  product: DefiProduct | undefined
  onChain: ChainId
}) {
  return (
    <Box
      display="grid"
      width="100%"
      gap={'32px'}
      margin={{ xs: '0px auto' }}
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
      <ChainTag chainId={onChain} />

      <CurrencyLogo
        currency={SUPPORTED_CURRENCIES[product?.investCurrency ?? '']}
        size={'52px'}
        style={{ zIndex: 2, position: 'absolute', right: 23, top: 20 }}
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
                text={`${product?.balance ?? '-'}  ${product?.investCurrency ?? '-'}`}
                subText="Your existing position"
              />
            </Box>
          </Box>
          <Box display="grid" gap={9}>
            <SimpleProgress
              val={product?.totalBalance ?? 0}
              total={product?.cap ?? 100}
              hideValue
              width="100%"
              customColor={color}
              height={8}
            />
            <Box display="flex" alignItems={'center'} justifyContent="space-between">
              <Typography fontSize={12} color="rgba(0,0,0,0.5)" fontWeight={500}>
                Total Balance: {product?.totalBalance ?? '-'} {product?.investCurrency ?? '-'}
              </Typography>
              <Typography fontSize={12} fontWeight={700}>
                Cap: {product?.cap ?? '-'} {product?.investCurrency ?? '-'}
              </Typography>{' '}
            </Box>
          </Box>
          {/* <Box display="flex" alignItems={'center'} justifyContent="space-between">
            <Typography fontSize={12} color="rgba(0,0,0,0.5)" fontWeight={500}>
              Countdown to the start
            </Typography>
            <Typography fontSize={12} fontWeight={700}>
              <Timer timer={product?.expiredAt ?? 0} />
            </Typography>{' '}
          </Box> */}
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

function ChainTag({ chainId }: { chainId: ChainId }) {
  return (
    <Box
      bgcolor="rgba(49, 176, 71, 0.2)"
      borderRadius="10px"
      padding="7px 14px"
      width="fit-content"
      display="flex"
      alignItems="center"
      gap={4.8}
    >
      <Image
        src={ChainListMap[chainId]?.logo}
        alt={`${ChainListMap[chainId]?.name} logo`}
        style={{ width: 14, height: 14 }}
      />
      <Typography color="#31B047" sx={{ letterSpacing: 2.4 }}>
        {ChainListMap[chainId]?.name}
      </Typography>
    </Box>
  )
}
