import { ComponentMeta } from '@storybook/react'
import { Button } from '@material-ui/core'
import SwitchChainModal from 'components/Modal/SwitchChainModal'
import useModal from 'hooks/useModal'
import DummyLogo from 'assets/images/ethereum-logo.png'

const fromChain = {
    logo: DummyLogo,
    symbol: 'ETH',
    id: 'XXX',
    address: 'XXXXXXXXXXXXXXXXXXXX',
    name: 'Ethereum Mainnet'
  },
  toChain = {
    logo: DummyLogo,
    symbol: 'BSC',
    id: 'XXX',
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
      Click to Open Warning Modal
    </Button>
  )
}
