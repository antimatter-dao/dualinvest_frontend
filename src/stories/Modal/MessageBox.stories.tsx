import { ComponentStory } from '@storybook/react'
import Button from 'components/Button/Button'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'

export default {
  title: 'Modal/MessageBox',
  component: MessageBox
}

export const DefaultTemplate: ComponentStory<typeof MessageBox> = ({ children, ...arg }: any) => {
  const { showModal } = useModal()
  return (
    <Button onClick={() => showModal(<MessageBox {...arg}>{children}</MessageBox>)}>
      Click to open {children} Message Box
    </Button>
  )
}

export const Success = DefaultTemplate.bind({})
Success.args = {
  type: 'success',
  children: 'Success'
}

export const Failure = DefaultTemplate.bind({})
Failure.args = {
  type: 'failure',
  children: 'Failure'
}

export const Support = DefaultTemplate.bind({})
Support.args = {
  type: 'support',
  children: 'Support'
}

export const Error = DefaultTemplate.bind({})
Error.args = {
  type: 'error',
  children: 'Error'
}

export const Warning = DefaultTemplate.bind({})
Warning.args = {
  type: 'warning',
  children: 'Warning'
}
