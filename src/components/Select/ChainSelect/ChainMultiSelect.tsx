import { ChangeEvent, useCallback } from 'react'
import { MenuItem, makeStyles } from '@material-ui/core'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import { Chain } from './index'
import InputLabel from 'components/Input/InputLabel'
import Checkbox from 'components/Checkbox'

interface Props {
  label?: string
  disabled?: boolean
  chainList: Chain[]
  selectedChains: Chain[]
  onChainSelect?: (chains: Chain[]) => void
  width?: string
}

const useStyles = makeStyles({
  menuItem: {
    '& label': {
      marginLeft: 20
    }
  }
})

export default function ChainMultiSelect(props: Props) {
  const classes = useStyles(props)
  const { label, disabled, chainList, onChainSelect, selectedChains, width } = props

  const isSelected = useCallback(
    (chain: Chain) => {
      return !!selectedChains.find(el => el.symbol === chain.symbol)
    },
    [selectedChains]
  )

  const renderValue = useCallback(() => {
    if (selectedChains.length > 0) {
      return selectedChains.map((chain: Chain) => chain.symbol).join(', ')
    }

    return 'Select the chain to enable crosschain functionality'
  }, [selectedChains])

  const handleChainSelect = useCallback(
    (e: ChangeEvent<{ value: string[] }>) => {
      const symbols: string[] = e.target.value
      const selectedItems: Chain[] = []

      for (let i = 0; i < symbols.length; i += 1) {
        const chain = chainList.find(chain => chain.symbol === symbols[i])
        if (chain) {
          selectedItems.push(chain)
        }
      }
      onChainSelect && onChainSelect(selectedItems)
    },
    [chainList, onChainSelect]
  )

  return (
    <div>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={selectedChains?.map(el => el.symbol) ?? []}
        disabled={disabled}
        onChange={handleChainSelect}
        width={width}
        multiple
        renderValue={renderValue}
      >
        {chainList.map(chain => (
          <MenuItem
            className={classes.menuItem}
            value={chain.symbol}
            key={chain.symbol}
            selected={!!selectedChains.find(el => el.symbol === chain.symbol)}
            disabled={selectedChains.length >= 2 && !isSelected(chain)}
          >
            <Checkbox checked={isSelected(chain)} />
            <LogoText logo={chain.logo} text={chain.symbol} />
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
