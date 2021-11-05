import { ComponentMeta } from '@storybook/react'
import { Button } from '@mui/material'
import SwitchChainModal from 'components/Modal/SwitchChainModal'
import useModal from 'hooks/useModal'
import DummyLogo from 'assets/images/ethereum-logo.png'

const fromChain = {
    logo: DummyLogo,
    symbol: 'ETH',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX',
    name: 'Ethereum Mainnet'
  },
  toChain = {
    logo: DummyLogo,
    symbol: 'BSC',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX',
    name: 'Binance Smart Chain'
  }

export default {
  title: 'Modal/SwitchChainModal',
  component: SwitchChainModal
} as ComponentMeta<typeof SwitchChainModal>

export const Default = () => {
  const { showModal, hideModal } = useModal()

  return (
    <Button
      onClick={() => {
        showModal(<SwitchChainModal onConfirm={hideModal} fromChain={fromChain} toChain={toChain} />)
      }}
      variant="contained"
    >
      Click to Open Switch Chain Modal
    </Button>
  )
}
