import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, MenuItem, Typography, useTheme } from '@mui/material'
import ProductBanner from 'components/ProductBanner'
import VaultProductCard from './VaultProductCard'
import { routes } from 'constants/routes'
import { ReactComponent as RecurVault } from 'assets/svg/recurVault.svg'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Select from 'components/Select/Select'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChainListMap } from 'constants/chain'
import { DefiProduct, useDefiVaultList } from 'hooks/useDefiVault'

export default function DefiVault() {
  const history = useHistory()
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const allList = useDefiVaultList()

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
        alignItems="center"
        sx={{
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        <Typography fontSize={16}>Strategy:</Typography>
        <Select width={isDownMd ? '100%' : '176px'} height={'44px'} placeholder="STRATEGY" selectedIcon={false}>
          <MenuItem value={'1'}>1</MenuItem>
          <MenuItem value={'2'}>2</MenuItem>
          <MenuItem value={'3'}>3</MenuItem>
        </Select>
        <Select width={isDownMd ? '100%' : '176px'} height={'44px'} placeholder="CHAIN" selectedIcon={false}>
          <MenuItem value={'1'}>BSC</MenuItem>
          <MenuItem value={'3'}>AVAX</MenuItem>
        </Select>
        <Select width={isDownMd ? '100%' : '176px'} height={'44px'} placeholder="SORT BY" selectedIcon={false}>
          <MenuItem value={'1'}>Newest First</MenuItem>
          <MenuItem value={'2'}>Oldest First</MenuItem>
          <MenuItem value={'3'}>Yield: High To Low</MenuItem>
          <MenuItem value={'3'}>Yield: Low To High</MenuItem>
        </Select>
      </Box>
      <Box
        display={'grid'}
        gap={21}
        width="100%"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        sx={{
          maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent })
        }}
      >
        {allList === null && <Typography>No vault available</Typography>}
        {allList &&
          allList.map((item: DefiProduct) => {
            if (!item) return null
            const { chainId, currency, type, investCurrency } = item
            if (!chainId || !currency) return null
            return (
              <React.Fragment key={chainId + (currency ?? '') + type}>
                <VaultProductCard
                  onChain={+chainId}
                  product={item}
                  title={`${currency} ${type === 'CALL' ? 'Covered Call' : 'Put Selling'} Recurring Strategy`}
                  description={`Generates yield by running an automated ${currency} ${
                    type === 'CALL' ? 'covered call' : 'put selling'
                  } strategy`}
                  onClick={() => {
                    history.push(
                      routes.defiVaultMgmt
                        .replace(':currency', currency ?? '')
                        .replace(':type', type)
                        .replace(':chainName', ChainListMap[+chainId].symbol)
                    )
                  }}
                  color={SUPPORTED_CURRENCIES[investCurrency ?? ''].color ?? theme.palette.primary.main}
                />
              </React.Fragment>
            )
          })}
      </Box>
    </Box>
  )
}
