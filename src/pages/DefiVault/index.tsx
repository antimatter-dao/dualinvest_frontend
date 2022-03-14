import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, MenuItem, useTheme } from '@mui/material'
import ProductBanner from 'components/ProductBanner'
import VaultCard from './VaultProductCard'
import { routes } from 'constants/routes'
import { ReactComponent as RecurVault } from 'assets/svg/recurVault.svg'
import { useRecurProcuctList } from 'hooks/useRecurData'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Select from 'components/Select/Select'
import useBreakpoint from 'hooks/useBreakpoint'

const SUPPORTED = ['BTC']

export default function DefiVault() {
  const history = useHistory()
  const data = useRecurProcuctList()
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  return (
    <Box
      id="defi"
      display="grid"
      justifyItems={{ xs: 'flex-start', md: 'center' }}
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      gap={{ xs: 36, md: 48 }}
    >
      <ProductBanner
        title="Defi option Vault"
        checkpoints={['Automated strategy for yield generation']}
        img={<RecurVault />}
      />
      <Box
        width="100%"
        display={{ xs: 'grid', md: 'flex' }}
        justifyContent={{ xs: undefined, md: 'flex-end' }}
        gap={32}
        marginLeft={20}
        sx={{
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        <Select width={isDownMd ? '100%' : '176px'} height={'60px'} placeholder="STRATEGY" selectedIcon={false}>
          <MenuItem value={'1'}>1</MenuItem>
          <MenuItem value={'2'}>2</MenuItem>
          <MenuItem value={'3'}>3</MenuItem>
        </Select>
        <Select width={isDownMd ? '100%' : '176px'} height={'60px'} placeholder="CHAIN" selectedIcon={false}>
          <MenuItem value={'1'}>BSC</MenuItem>
          <MenuItem value={'3'}>AVAX</MenuItem>
        </Select>
        <Select width={isDownMd ? '100%' : '176px'} height={'60px'} placeholder="SORT BY" selectedIcon={false}>
          <MenuItem value={'1'}>Newest First</MenuItem>
          <MenuItem value={'2'}>Oldest First</MenuItem>
          <MenuItem value={'3'}>Yield: High To Low</MenuItem>
          <MenuItem value={'3'}>Yield: Low To High</MenuItem>
        </Select>
      </Box>
      <Box
        display={'grid'}
        gap={41}
        width="100%"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        sx={{
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        {SUPPORTED.map(key => {
          return (
            <React.Fragment key={key}>
              <VaultCard
                product={data?.[key as keyof typeof data]?.call}
                logoCurSymbol={key}
                title={`${key} Covered Call Strategy`}
                description={`Generates yield by running an automated ${key} covered call strategy`}
                onClick={() => {
                  history.push(routes.defiVaultMgmt.replace(':currency', key).replace(':type', 'call'))
                }}
                color={SUPPORTED_CURRENCIES[key].color ?? theme.palette.primary.main}
              />
              <VaultCard
                product={data?.[key as keyof typeof data]?.put}
                logoCurSymbol="USDT"
                title={`${key} Put Selling Strategy`}
                description="Generates yield by running an automated put selling strategy"
                onClick={() => {
                  history.push(routes.defiVaultMgmt.replace(':currency', key).replace(':type', 'put'))
                }}
                color={SUPPORTED_CURRENCIES['USDT'].color ?? theme.palette.primary.main}
              />
            </React.Fragment>
          )
        })}
      </Box>
    </Box>
  )
}
