import React, { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, MenuItem, Typography, useTheme } from '@mui/material'
import ProductBanner from 'components/ProductBanner'
import VaultProductCard from './VaultProductCard'
import { routes } from 'constants/routes'
import { SUPPORTED_CURRENCIES, SUPPORTED_DEFI_VAULT } from 'constants/currencies'
import Select from 'components/Select/Select'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChainId, ChainListMap } from 'constants/chain'
import { DefiProduct, useDefiVaultList } from 'hooks/useDefiVault'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import NoDataCard from 'components/Card/NoDataCard'

// enum SortBy {
//   highToLow = 'hl',
//   lowToHigh = 'lh'
// }

enum Strategy {
  all = 'ALL',
  call = 'CALL',
  put = 'PUT'
}

const formatAssetVal = (chainId: ChainId, curSymbol: string) => {
  return chainId + '-' + curSymbol
}

const filterDepositAsset = (selected: string, item: DefiProduct) => {
  const splited = selected.split('-')
  if (splited[0] === `${item.chainId}` && splited[1] === item.investCurrency) {
    return true
  }
  return false
}

export default function DefiVault() {
  const history = useHistory()
  const theme = useTheme()
  const isDownSm = useBreakpoint('sm')
  // const [sortBy, setSortBy] = useState<SortBy>(SortBy.highToLow)
  const [strategy, setStrategy] = useState<Strategy>(Strategy.all)
  const [depositAsset, setDepositAsset] = useState<string>('ALL')
  const allList = useDefiVaultList()

  const filteredList = useMemo(() => {
    if (!allList) return undefined
    const list = allList.reduce((acc, item) => {
      if (strategy === Strategy.all || item.type == strategy) {
        if (depositAsset === 'ALL' || filterDepositAsset(depositAsset, item)) {
          acc.push(item)
        }

        return acc
      }

      return acc
    }, [] as DefiProduct[])

    // const sorted = list.sort((a, b) => {
    //   const isLarger = +a.apy.replace('%', '') > +b.apy.replace('%', '')
    //   return sortBy === SortBy.highToLow ? (isLarger ? -1 : 1) : isLarger ? 1 : -1
    // })
    // return sorted
    return list
  }, [allList, depositAsset, strategy])

  // const handleSortBy = useCallback(e => {
  //   setSortBy(e.target.value)
  // }, [])

  const handleStreragy = useCallback(e => {
    setStrategy(e.target.value)
  }, [])

  const handleDepositAsset = useCallback(e => {
    setDepositAsset(e.target.value)
  }, [])

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
        imgFileName={'defi_vault'}
        svgMargin={'0 0 -12px'}
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
            <Select
              width={isDownSm ? '100%' : '176px'}
              height={'44px'}
              defaultValue="ALL"
              onChange={handleStreragy}
              value={strategy}
            >
              <MenuItem value={'ALL'}>All </MenuItem>
              <MenuItem value={'CALL'}>Covered Call </MenuItem>
              <MenuItem value={'PUT'}>Put Selling </MenuItem>
            </Select>
          </Box>
          <Box display={{ xs: 'grid', sm: 'flex' }} width={{ xs: '100%', sm: 'auto' }} alignItems="center" gap="14px">
            <Typography fontSize={16}>Deposit Asset:</Typography>
            <Select
              width={isDownSm ? '100%' : '232px'}
              height={'44px'}
              defaultValue="ALL"
              value={depositAsset}
              onChange={handleDepositAsset}
            >
              {Object.keys(SUPPORTED_DEFI_VAULT).reduce(
                (acc, chainId) => {
                  const list = SUPPORTED_DEFI_VAULT[+chainId as ChainId]
                  if (list) {
                    list.map(curSymbol => {
                      const val = formatAssetVal(+chainId, curSymbol)
                      acc.push(
                        <MenuItem value={val} key={val}>
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
                    <MenuItem value={formatAssetVal(+chainId, 'USDT')} key={formatAssetVal(+chainId, 'USDT')}>
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
        {/* <Box
          display={{ xs: 'grid', sm: 'flex' }}
          width={{ xs: '100%', sm: 'max-content' }}
          alignItems="center"
          gap="14px"
        >
          <Typography fontSize={16} whiteSpace="nowrap">
            Sort by:
          </Typography>
          <Select width={isDownSm ? '100%' : '189px'} height={'44px'} onChange={handleSortBy} value={sortBy}>
            <MenuItem value={SortBy.highToLow}>Yield: High To Low</MenuItem>
            <MenuItem value={SortBy.lowToHigh}>Yield: Low To High</MenuItem>
          </Select>
        </Box> */}
      </Box>
      {filteredList && filteredList.length === 0 && <NoDataCard />}
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
        {filteredList &&
          filteredList.map((item: DefiProduct) => {
            if (!item) return null
            const { chainId, currency, type } = item
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
                  color={type === 'CALL' ? theme.palette.primary.main : '#D65049'}
                />
              </React.Fragment>
            )
          })}
      </Box>
    </Box>
  )
}
