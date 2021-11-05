import { ComponentMeta } from '@storybook/react'
import { Button } from '@mui/material'
import WarningModal, { WarningModalContent } from 'components/Modal/WarningModal'
import useModal from 'hooks/useModal'

export default {
  title: 'Modal/WarningModal',
  component: WarningModal
} as ComponentMeta<typeof WarningModal>

export const Default = () => {
  const { showModal, hideModal } = useModal()

  return (
    <Button
      onClick={() => {
        showModal(<WarningModalContent onDismiss={hideModal} />)
      }}
      variant="contained"
    >
      Click to Open Warning Modal
    </Button>
  )
}
