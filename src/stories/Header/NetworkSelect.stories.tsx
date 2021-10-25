import { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import { MenuItem, makeStyles } from '@material-ui/core'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
import DummyIcon from 'assets/images/ethereum-logo.png'
import LogoText from 'components/LogoText'
import Select from 'components/Select/Select'

export default {
  title: 'Header/NetworkSelect',
  component: Select
} as ComponentMeta<typeof Select>

const ChainList = [
  {
    logo: DummyIcon,
    symbol: 'ETH',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX'
  },
  {
    logo: DummyIcon,
    symbol: 'BSC',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX'
  }
]

const useStyles = makeStyles(() => ({
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
}))

export const Network = () => {
  const [chain, setChain] = useState(ChainList[0])
  const classes = useStyles()

  function onChangeChain(e: any) {
    const chain = ChainList.filter(el => el.symbol === e.target.value)[0]
    setChain(chain)
  }
  return (
    <Select defaultValue={chain.symbol} value={chain.symbol} size={'small'} onChange={onChangeChain} width="88px">
      {ChainList.map(option => (
        <MenuItem
          className={classes.menuItem}
          value={option.symbol}
          key={option.symbol}
          selected={chain.symbol === option.symbol}
        >
          <LogoText logo={option.logo} text={option.symbol} gapSize={'small'} fontSize={14} />
        </MenuItem>
      ))}
    </Select>
  )
}
