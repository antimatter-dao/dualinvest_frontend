import SwapChain from 'components/Modal/TransactionModals/SwapChain'
import WithdrawConfirmationModal from 'components/Modal/TransactionModals/WithdrawConfirmationModal'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { Box, Typography } from '@mui/material'
import LogoText from 'components/LogoText'
import DestinationAddress from 'components/Modal/TransactionModals/DestinationAddress'
import { ComponentStory } from '@storybook/react'
import Button from 'components/Button/Button'
import { useState } from 'react'

export default {
  title: 'Modal/WithdrawConfirmationModal',
  component: WithdrawConfirmationModal
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

const DefaultTemplate: ComponentStory<typeof WithdrawConfirmationModal> = ({ isStep3Active }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Click to open Withdraw Confirmation isStep3Active={isStep3Active.toString()}
      </Button>
      <WithdrawConfirmationModal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false)
        }}
        isStep3Active={isStep3Active}
        fromChain={fromChain}
        toChain={toChain}
        destinationAddress="0xEc269687bcD28B1d52Fa88f9d2d3D97A987Ae146"
        step1={
          <>
            Please switch your wallet network
            <br /> to BSC to complete token swap.
          </>
        }
        step2={
          <>
            Please make your connected wallet address is the address where you wish to receive your bridged NFT and the
            correct destination chain.
          </>
        }
      >
        <Box display="grid" gap="15px" justifyItems="center">
          <Typography fontSize={40} fontWeight={500} textAlign="center">
            1 ETH
          </Typography>
          <Box display="flex" justifyContent="center" marginTop="16px">
            <LogoText logo={DummyLogo} text={'ETH'} fontWeight={500} />
          </Box>
        </Box>
      </WithdrawConfirmationModal>
    </>
  )
}

export const Step3NotActive = DefaultTemplate.bind({})
Step3NotActive.args = {
  isStep3Active: false
}
export const Step3Active = DefaultTemplate.bind({})
Step3Active.args = {
  isStep3Active: true
}

export const SwapChainComponent: ComponentStory<typeof SwapChain> = () => {
  return <SwapChain from={fromChain} to={toChain} />
}

export const DestimationAddressComponent: ComponentStory<typeof DestinationAddress> = () => {
  return <DestinationAddress address="0xEc269687bcD28B1d52Fa88f9d2d3D97A987Ae146" />
}
