import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, MenuItem, Typography, useTheme } from '@mui/material'
import ProductBanner from 'components/ProductBanner'
import VaultProductCard from './VaultProductCard'
import { routes } from 'constants/routes'
import { ReactComponent as RecurVault } from 'assets/svg/recurVault.svg'
import { SUPPORTED_CURRENCIES, SUPPORTED_DEFI_VAULT } from 'constants/currencies'
import Select from 'components/Select/Select'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChainId, ChainListMap } from 'constants/chain'
import { DefiProduct, useDefiVaultList } from 'hooks/useDefiVault'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function DefiVault() {
  const history = useHistory()
  const theme = useTheme()
  const isDownSm = useBreakpoint('sm')
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
        justifyContent={{ xs: undefined, sm: 'space-between' }}
        gap={{ xs: 10, sm: 32 }}
        alignItems="center"
        padding={{ xs: '0 20px', lg: '0' }}
        sx={{
          maxWidth: theme => ({ xs: `calc(100%)`, lg: theme.width.maxContent })
        }}
      >
        <Box display={{ xs: 'grid', sm: 'flex' }} gap={{ xs: 10, sm: 32 }} width="100%">
          <Box display={{ xs: 'grid', sm: 'flex' }} width={{ xs: '100%', sm: 'auto' }} alignItems="center" gap="14px">
            <Typography fontSize={16}>Strategy:</Typography>
            <Select width={isDownSm ? '100%' : '176px'} height={'44px'} defaultValue="ALL">
              <MenuItem value={'ALL'}>All </MenuItem>
              <MenuItem value={'CALL'}>Covered Call </MenuItem>
              <MenuItem value={'PUT'}>Put Selling </MenuItem>
            </Select>
          </Box>
          <Box display={{ xs: 'grid', sm: 'flex' }} width={{ xs: '100%', sm: 'auto' }} alignItems="center" gap="14px">
            <Typography fontSize={16}>Deposit Asset:</Typography>
            <Select width={isDownSm ? '100%' : '232px'} height={'44px'} defaultValue="ALL">
              {Object.keys(SUPPORTED_DEFI_VAULT).reduce(
                (acc, chainId) => {
                  const list = SUPPORTED_DEFI_VAULT[+chainId as ChainId]
                  if (list) {
                    list.map(curSymbol => {
                      acc.push(
                        <MenuItem value={'1'} key="curSymbol">
                          <Box display="flex" alignItems={'center'} gap={10}>
                            <CurrencyLogo currency={SUPPORTED_CURRENCIES[curSymbol]} size={'22px'} />
                            <Box>
                              {curSymbol}{' '}
                              <Typography component="span" fontSize={12}>
                                ({ChainListMap[+chainId as ChainId].name})
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      )
                    })
                  }
                  acc.push(
                    <MenuItem value={'1'}>
                      {' '}
                      <Box display="flex" alignItems={'center'} gap={10}>
                        <CurrencyLogo currency={SUPPORTED_CURRENCIES['USDT']} size={'22px'} />
                        <Box>
                          USDT{' '}
                          <Typography component="span" fontSize={12}>
                            ({ChainListMap[+chainId as ChainId].name})
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  )
                  return acc
                },
                [
                  <MenuItem value={'ALL'} key="ALL">
                    All
                  </MenuItem>
                ] as JSX.Element[]
              )}
            </Select>
          </Box>
        </Box>
        <Box
          display={{ xs: 'grid', sm: 'flex' }}
          width={{ xs: '100%', sm: 'max-content' }}
          alignItems="center"
          gap="14px"
        >
          <Typography fontSize={16} whiteSpace="nowrap">
            Sort by:
          </Typography>
          <Select width={isDownSm ? '100%' : '176px'} height={'44px'} defaultValue="ALL">
            <MenuItem value={'ALL'}>All </MenuItem>
            <MenuItem value={'1'}>Newest First</MenuItem>
            <MenuItem value={'2'}>Oldest First</MenuItem>
            <MenuItem value={'3'}>Yield: High To Low</MenuItem>
            <MenuItem value={'3'}>Yield: Low To High</MenuItem>
          </Select>{' '}
        </Box>
      </Box>
      <Box
        display={'grid'}
        gap={21}
        width="100%"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        padding={{ xs: '0 20px', lg: '0' }}
        sx={{
          maxWidth: theme => ({ xs: '100%', lg: theme.width.maxContent })
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
