import { ComponentStory, ComponentMeta } from '@storybook/react'
import ChainSelect from 'components/Select/ChainSelect'
import { Chain } from 'models/chain'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { useState } from 'react'

export default {
  title: 'Input/ChainSelect',
  component: ChainSelect
} as ComponentMeta<typeof ChainSelect>

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

const DefaultTemplate: ComponentStory<typeof ChainSelect> = () => {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)

  return <ChainSelect chainList={ChainList} selectedChain={selectedChain} onChange={chain => setSelectedChain(chain)} />
}
export const Default = DefaultTemplate.bind({})
