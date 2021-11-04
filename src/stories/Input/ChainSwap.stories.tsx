import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'
import ChainSwap from 'components/Select/ChainSwap'
import DummyLogo from 'assets/images/ethereum-logo.png'
import ChainSelect from 'components/Select/ChainSelect'
import { Chain } from 'models/chain'
import { Box } from '@mui/material'
import TextButton from 'components/Button/TextButton'
import SwitchButton from 'components/Select/ChainSwap/SwitcherButton'

export default {
  title: 'Input/ChainSwap',
  component: ChainSwap
} as ComponentMeta<typeof ChainSwap>

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

const DefaultTemplate: ComponentStory<typeof ChainSwap> = function({
  disabledFrom,
  disabledTo,
  activeFrom,
  activeTo
}: any) {
  const [fromChain, setFromChain] = useState<Chain | null>(null)
  const [toChain, setToChain] = useState<Chain | null>(null)

  const handleSwitch = () => {
    const from = fromChain
    const to = toChain
    setFromChain(to)
    setToChain(from)
  }

  // return (
  //   <ChainSwap
  //     fromChain={fromChain}
  //     toChain={toChain}
  //     chainList={ChainList}
  //     onSelectFrom={function(chain: Chain | null) {
  //       setFromChain(chain)
  //     }}
  //     onSelectTo={function(chain: Chain | null) {
  //       setToChain(chain)
  //     }}
  //     disabledFrom={false}
  //     disabledTo={false}
  //     {...args}
  //   />
  // )
  return (
    <>
      <p>use components/Select/ChainSwap instead code here only for demo</p>
      <Box display="flex" justifyContent="space-between" alignItems={'flex-end'} position={'relative'} width="100%">
        <ChainSelect
          label={'From'}
          selectedChain={fromChain}
          chainList={ChainList}
          onChange={chain => setFromChain(chain)}
          width={'49%'}
          disabled={disabledFrom}
          active={activeFrom}
        />
        <Box position={'absolute'} left={'calc(50% - 16px)'} zIndex={99} padding="0px" height="32px" bottom="8px">
          <TextButton onClick={handleSwitch}>
            <SwitchButton />
          </TextButton>
        </Box>
        <ChainSelect
          label={'To'}
          selectedChain={toChain}
          chainList={ChainList}
          onChange={chain => setToChain(chain)}
          width={'49%'}
          disabled={disabledTo}
          active={activeTo}
        />
      </Box>
    </>
  )
}
export const Default = DefaultTemplate.bind({})

export const Active = DefaultTemplate.bind({})
Active.args = {
  activeFrom: true,
  activeTo: true
}

export const Disbaled = DefaultTemplate.bind({})
Disbaled.args = {
  disabledFrom: true,
  disabledTo: true
}
