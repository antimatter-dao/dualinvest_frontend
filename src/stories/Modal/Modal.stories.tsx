import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from '@material-ui/core'
import Modal from 'components/Modal'
import { useWalletModalToggle } from 'state/application/hooks'
import WalletModal from 'components/muiModal/WalletModal'

export default {
  title: 'Modal/WalletModal',
  component: Modal
} as ComponentMeta<typeof Modal>

const DefaultTemplate: ComponentStory<typeof Modal> = () => {
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

export const Default = DefaultTemplate.bind({})
Default.args = {}
