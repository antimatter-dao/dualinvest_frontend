import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Chain } from 'models/chain'
import ChainMultiSelect from 'components/Select/ChainSelect/ChainMultiSelect'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { useState } from 'react'

export default {
  title: 'Input/ChainMultiSelect ',
  component: ChainMultiSelect
} as ComponentMeta<typeof ChainMultiSelect>

const ChainList = [
  {
    logo: DummyLogo,
    symbol: 'ETH',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX',
    name: 'Ethereum Mainnet'
  },
  {
    logo: DummyLogo,
    symbol: 'BSC',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX',
    name: 'Binance Smart Chain'
  }
]

const DefaultTemplate: ComponentStory<typeof ChainMultiSelect> = () => {
  const [selectedChains, setSelectedChains] = useState<Chain[]>([])

  return (
    <ChainMultiSelect
      chainList={ChainList}
      selectedChains={selectedChains}
      onChainSelect={chains => {
        setSelectedChains(chains)
      }}
    />
  )
}
export const Default = DefaultTemplate.bind({})
