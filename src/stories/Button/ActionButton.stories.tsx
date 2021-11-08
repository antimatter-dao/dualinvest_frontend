import { ComponentStory, ComponentMeta } from '@storybook/react'

import ActionButton from 'components/Button/ActionButton'

export default {
  title: 'Button/ActionButton',
  component: ActionButton
} as ComponentMeta<typeof ActionButton>

const DefaultTemplate: ComponentStory<typeof ActionButton> = args => (
  <ActionButton
    {...args}
    actionText="Press"
    onAction={() => {
      console.log('action')
    }}
  />
)

export const Default = DefaultTemplate.bind({})

export const Pending = DefaultTemplate.bind({})
Pending.args = {
  pending: true,
  pendingText: 'Pending'
}

export const Succeed = DefaultTemplate.bind({})
Succeed.args = {
  success: true,
  successText: 'Succeed'
}
