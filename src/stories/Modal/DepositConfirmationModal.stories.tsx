import Button from 'components/Button/Button'
import SwapChain from 'components/Modal/TransactionModals/SwapChain'
import DepositConfirmationModal from 'components/Modal/TransactionModals/DepositConfirmationModal'
import useModal from 'hooks/useModal'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { Typography, Box } from '@material-ui/core'
import { Text } from 'rebass'
import LogoText from 'components/LogoText'
import DestinationAddress from 'components/Modal/TransactionModals/DestinationAddress'
import { ComponentStory } from '@storybook/react'

export default {
  title: 'Modal/DepositConfirmationModal',
  component: DepositConfirmationModal
}

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

export const Default = () => {
  const { showModal } = useModal()
  return (
    <Button
      onClick={() => {
        showModal(
          <DepositConfirmationModal
            fromChain={fromChain}
            toChain={toChain}
            destinationAddress="0xKos369cd6vwd94wq1gt4hr87ujv"
          >
            <Box display="grid" gridGap="15px" justifyItems="center">
              <Typography variant="h6">Test</Typography>
              <Text fontSize={40} fontWeight={500} textAlign="center">
                1 ETH
              </Text>
              <Box display="flex" justifyContent="center" marginTop="16px">
                <LogoText logo={DummyLogo} text={'ETH'} fontWeight={500} />
              </Box>
            </Box>
          </DepositConfirmationModal>
        )
      }}
    >
      Click to open Deposit Confirmation modal
    </Button>
  )
}

export const SwapChainComponent: ComponentStory<typeof SwapChain> = () => {
  return <SwapChain from={fromChain} to={toChain} />
}

export const DestimationAddressComponent: ComponentStory<typeof DestinationAddress> = () => {
  return <DestinationAddress address="0xKos369cd6vwd94wq1gt4hr87ujv" />
}
