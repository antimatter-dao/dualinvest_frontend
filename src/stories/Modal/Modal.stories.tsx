import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from '@material-ui/core'
import Modal from 'components/Modal'
import WalletModal from 'components/muiModal/WalletModal'
import useModal from 'hooks/useModal'

export default {
  title: 'Modal/WalletModal',
  component: Modal
} as ComponentMeta<typeof Modal>

// const DefaultTemplate: ComponentStory<typeof Modal> = (args) => (
//   <Modal {...args}>
//     <WalletModal onDismiss={() => {}} />
//   </Modal>
// )
const DefaultTemplate: ComponentStory<typeof Modal> = () => {
  const { showModal, hideModal } = useModal()

  return (
    <Button
      onClick={() => {
        showModal(<WalletModal onDismiss={hideModal} />)
      }}
      variant="contained"
    >
      Click to Open Wallet Modal
    </Button>
  )
}

export const Default = DefaultTemplate.bind({})
Default.args = {}
