import { useEffect } from 'react'
import { Box, Button } from '@material-ui/core'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import Modal from 'components/Modal'
import AccountDetails from 'components/Modal/WalletModal/AccountDetails'
import useModal from 'hooks/useModal'
import { useTransactionAdder } from 'state/transactions/hooks'
// import JSBI from 'jsbi'

export default {
  title: 'Modal/AccountDetailsModal',
  component: AccountDetails
} as ComponentMeta<typeof AccountDetails>

const DefaultTemplate: ComponentStory<typeof AccountDetails> = (args: any) => {
  const { showModal } = useModal()
  const addTxn = useTransactionAdder()

  useEffect(() => {
    // addTxn(
    //   { hash: 'test', from: 'address1', to: 'address2', nonce: 1, gasLimit: JSBI.BigInt(0) },
    //   {
    //     summary: 'Account details modal test'
    //   }
    // )
  }, [addTxn])

  return (
    <Button
      variant="contained"
      onClick={() => {
        showModal(
          <Modal customIsOpen={true} customOnDismiss={() => {}} maxWidth="560px" closeIcon={true}>
            <Box width={'100%'} padding="32px" display="flex" flexDirection="column" alignItems="center" gridGap={20}>
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
