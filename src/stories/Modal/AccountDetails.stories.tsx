import { Box, Button } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import Modal from 'components/Modal'
import AccountDetails from 'components/Modal/WalletModal/AccountDetails'
import useModal from 'hooks/useModal'

export default {
  title: 'Modal/AccountDetailsModal',
  component: AccountDetails
} as ComponentMeta<typeof AccountDetails>

const DefaultTemplate: ComponentStory<typeof AccountDetails> = (args: any) => {
  const { showModal } = useModal()

  return (
    <Button
      variant="contained"
      onClick={() => {
        showModal(
          <Modal customIsOpen={true} customOnDismiss={() => {}} maxWidth="560px" closeIcon={true}>
            <Box width={'100%'} padding="32px" display="flex" flexDirection="column" alignItems="center" gap={20}>
              <AccountDetails
                {...args}
                toggleWalletModal={() => {}}
                pendingTransactions={['test1', 'test2']}
                confirmedTransactions={['test3', 'test4']}
                openOptions={() => {}}
              />
            </Box>
          </Modal>
        )
      }}
    >
      Click to open Account Details
    </Button>
  )
}

export const Default = DefaultTemplate.bind({})
