import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from '@material-ui/core'
import Modal from 'components/Modal'
import WarningModal from 'components/muiModal/WarningModal'
import useModal from 'hooks/useModal'

export default {
  title: 'Modal/WarningModal',
  component: Modal
} as ComponentMeta<typeof Modal>

const DefaultTemplate: ComponentStory<typeof Modal> = () => {
  const { showModal } = useModal()

  return (
    <Button
      onClick={() => {
        showModal(<WarningModal />)
      }}
      variant="contained"
    >
      Click to Open Warning Modal
    </Button>
  )
}

export const Default = DefaultTemplate.bind({})
Default.args = {}
