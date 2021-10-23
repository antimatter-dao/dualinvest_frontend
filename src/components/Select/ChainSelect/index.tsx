import { MenuItem, makeStyles } from '@material-ui/core'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import InputLabel from 'components/Input/InputLabel'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'

export interface Chain {
  logo: string
  symbol: string
  id: string
  address: string
}

interface Props {
  label?: string
  disabled?: boolean
  chainList: Chain[]
  selectedChain: Chain | null
  onChange?: (e: any) => void
  width?: string
  active?: boolean
  placeholder?: string
}

const useStyles = makeStyles({
  menuItem: {
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
  }
})

export default function ChainSelect(props: Props) {
  const classes = useStyles(props)
  const { label, disabled, chainList, onChange, selectedChain, width, active, placeholder } = props

  return (
    <div>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        defaultValue={selectedChain?.symbol}
        value={selectedChain?.symbol ?? ''}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder ?? 'Select Chain'}
        width={width}
        primary={active}
      >
        {chainList.map(option => (
          <MenuItem
            className={classes.menuItem}
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
