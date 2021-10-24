import { ComponentStory, ComponentMeta } from '@storybook/react'
import ChainSelect, { Chain } from 'components/Select/ChainSelect'
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
    id: 'XXX',
    address: 'XXXXXXXXXXXXXXXXXXXX'
  },
  {
    logo: DummyLogo,
    symbol: 'BSC',
    id: 'XXX',
    address: 'XXXXXXXXXXXXXXXXXXXX'
  },
  {
    logo: DummyLogo,
    symbol: 'OEC',
    id: 'XXX',
    address: 'XXXXXXXXXXXXXXXXXXXX'
  }
]

const DefaultTemplate: ComponentStory<typeof ChainSelect> = () => {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)

  return <ChainSelect chainList={ChainList} selectedChain={selectedChain} onChange={chain => setSelectedChain(chain)} />
}
export const Default = DefaultTemplate.bind({})
