import { useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import { Box, Typography, styled } from '@mui/material'
import { Currency } from 'constants/token'
import { Mode } from './SelectCurrencyModal'
import useModal from 'hooks/useModal'
import CurrencyLogo from 'components/essential/CurrencyLogo'

interface Props {
  selectedCurrency?: Currency | null
  mode?: Mode
  onSelectCurrency?: (currency: Currency) => void
  currencyOptions: Currency[]
}

const ListItem = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  padding: '0 32px',
  height: '48px',
  justifyContent: 'space-between'
})

export default function CurrencyList({ mode, onSelectCurrency, currencyOptions }: Props) {
  const { hideModal } = useModal()

  const currencyKey = useCallback((currency: Currency): string => {
    return currency ? currency.symbol || '' : ''
  }, [])

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [currencyKey])

  const Row = useCallback(
    ({ data, index }: any) => {
      const currency: Currency = data[index]
      const onClickCurrency = () => {
        onSelectCurrency && onSelectCurrency(currency)
        hideModal()
      }

      return (
        <ListItem onClick={mode === Mode.SELECT ? onClickCurrency : () => {}}>
          <Box display="flex">
            <CurrencyLogo currency={currency} style={{ width: '30px', height: '30px' }} />
            <Box display="flex" flexDirection="column" marginLeft="16px">
              <Typography variant="inherit">{currency.symbol}</Typography>
              <Typography variant="caption">{currency.name}</Typography>
            </Box>
          </Box>
          {mode === Mode.SELECT && <span style={{ fontWeight: 500 }}>{0}</span>}
        </ListItem>
      )
    },
    [hideModal, mode, onSelectCurrency]
  )

  return (
    <FixedSizeList
      height={290}
      width="100%"
      itemCount={currencyOptions.length}
      itemSize={56}
      itemData={currencyOptions}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
