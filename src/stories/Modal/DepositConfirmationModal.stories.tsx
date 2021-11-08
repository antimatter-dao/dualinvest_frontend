import Button from 'components/Button/Button'
import SwapChain from 'components/Modal/TransactionModals/SwapChain'
import DepositConfirmationModal from 'components/Modal/TransactionModals/DepositConfirmationModal'
import useModal from 'hooks/useModal'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { Typography, Box } from '@mui/material'
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

export const Default = () => {
  const { showModal } = useModal()
  return (
    <Button
      onClick={() => {
        showModal(
          <DepositConfirmationModal
            fromChain={fromChain}
            toChain={toChain}
            destinationAddress="0xEc269687bcD28B1d52Fa88f9d2d3D97A987Ae146"
          >
            <Box display="grid" gap="15px" justifyItems="center">
              <Typography variant="h6">Test</Typography>
              <Typography fontSize={40} fontWeight={500} textAlign="center">
                1 ETH
              </Typography>
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
  return <DestinationAddress address="0xEc269687bcD28B1d52Fa88f9d2d3D97A987Ae146" />
}
