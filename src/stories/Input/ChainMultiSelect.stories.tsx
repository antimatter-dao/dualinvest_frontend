import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Chain } from 'components/Select/ChainSelect'
import ChainMultiSelect from 'components/Select/ChainSelect/ChainMultiSelect'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { ChangeEvent, useCallback, useState } from 'react'

export default {
  title: 'Input/ChainMultiSelect ',
  component: ChainMultiSelect
} as ComponentMeta<typeof ChainMultiSelect>

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

const DefaultTemplate: ComponentStory<typeof ChainMultiSelect> = () => {
  const [selectedChains, setSelectedChains] = useState<Chain[]>([])

  const onChainSelect = useCallback((e: ChangeEvent<{ value: string[] }>) => {
    const symbols: string[] = e.target.value
    const selectedItems = []

    for (let i = 0; i < symbols.length; i += 1) {
      const chain = ChainList.find(chain => chain.symbol === symbols[i])
      if (chain) {
        selectedItems.push(chain)
      }
    }
    setSelectedChains(selectedItems)
  }, [])

  return <ChainMultiSelect chainList={ChainList} selectedChains={selectedChains} onChange={onChainSelect} />
}
export const Default = DefaultTemplate.bind({})
