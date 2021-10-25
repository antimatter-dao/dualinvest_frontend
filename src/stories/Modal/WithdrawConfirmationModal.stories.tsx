import SwapChain from 'components/Modal/TransactionModals/SwapChain'
import WithdrawConfirmationModal from 'components/Modal/TransactionModals/WithdrawConfirmationModal'
import useModal from 'hooks/useModal'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { Box } from '@material-ui/core'
import { Text } from 'rebass'
import LogoText from 'components/LogoText'
import DestinationAddress from 'components/Modal/TransactionModals/DestinationAddress'
import { ComponentStory } from '@storybook/react'
import Button from 'components/Button/Button'

export default {
  title: 'Modal/WithdrawConfirmationModal',
  component: WithdrawConfirmationModal
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

const DefaultTemplate: ComponentStory<typeof WithdrawConfirmationModal> = ({ isStep3Active }: any) => {
  const { showModal } = useModal()
  return (
    <Button
      onClick={() => {
        showModal(
          <WithdrawConfirmationModal
            isStep3Active={isStep3Active}
            fromChain={fromChain}
            toChain={toChain}
            destinationAddress="0xKos369cd6vwd94wq1gt4hr87ujv"
            step1={
              <>
                Please switch your wallet network
                <br /> to BSC to complete token swap.
              </>
            }
            step2={
              <>
                Please make your connected wallet address is the address where you wish to receive your bridged NFT and
                the correct destination chain.
              </>
            }
          >
            <Box display="grid" gridGap="15px" justifyItems="center">
              <Text fontSize={40} fontWeight={500} textAlign="center">
                1 ETH
              </Text>
              <Box display="flex" justifyContent="center" marginTop="16px">
                <LogoText logo={DummyLogo} text={'ETH'} fontWeight={500} />
              </Box>
            </Box>
          </WithdrawConfirmationModal>
        )
      }}
    >
      Click to open Withdraw Confirmation isStep3Active={isStep3Active.toString()}
    </Button>
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
  return <DestinationAddress address="0xKos369cd6vwd94wq1gt4hr87ujv" />
}
