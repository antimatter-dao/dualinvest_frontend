import { MenuItem } from '@mui/material'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import InputLabel from 'components/Input/InputLabel'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
import { useCallback } from 'react'
import { Chain } from 'models/chain'

export default function ChainSelect({
  label,
  disabled,
  chainList,
  onChange,
  selectedChain,
  width,
  active,
  placeholder
}: {
  label?: string
  disabled?: boolean
  chainList: Chain[]
  selectedChain: Chain | null
  onChange?: (chain: Chain | null) => void
  width?: string
  active?: boolean
  placeholder?: string
}) {
  const handleChange = useCallback(
    e => {
      const chain = chainList.find(chain => chain.symbol === e.target.value) ?? null
      onChange && onChange(chain)
    },
    [chainList, onChange]
  )

  return (
    <div style={{ width }}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        defaultValue={selectedChain?.symbol}
        value={selectedChain?.symbol ?? ''}
        disabled={disabled}
        onChange={handleChange}
        placeholder={placeholder ?? 'Select Chain'}
        width={'100%'}
        primary={active}
      >
        {chainList.map(option => (
          <MenuItem
            sx={{
              '&::before': {
                content: '""',
                width: 30,
                height: 20,
                display: 'flex',
                justifyContent: 'center'
              },
              '&.Mui-selected::before': {
                content: `url(${SelectedIcon})`,
                width: 30,
                height: 20,
                display: 'flex',
                justifyContent: 'center'
              }
            }}
            value={option.symbol}
            key={option.symbol}
            selected={selectedChain?.symbol === option.symbol}
          >
            <LogoText logo={option.logo} text={option.symbol} />
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
