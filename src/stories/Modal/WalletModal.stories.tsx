import { ComponentMeta } from '@storybook/react'
import { Button } from '@mui/material'
import { useWalletModalToggle } from 'state/application/hooks'
import WalletModal from 'components/Modal/WalletModal'

export default {
  title: 'Modal/WalletModal',
  component: WalletModal
} as ComponentMeta<typeof WalletModal>

export const Default = () => {
  const toggleWalletModal = useWalletModalToggle()

  return (
    <>
      <Button onClick={toggleWalletModal} variant="contained">
        Click to Open Wallet Modal ( components/Modal/WalletModal/index)
      </Button>
      <WalletModal pendingTransactions={[]} confirmedTransactions={[]} />
    </>
  )
}
