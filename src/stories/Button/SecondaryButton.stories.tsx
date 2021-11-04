import { ComponentStory, ComponentMeta } from '@storybook/react'

import SecondaryButton from 'components/Button/SecondaryButton'

export default {
  title: 'Button/SecondaryButton',
  component: SecondaryButton
} as ComponentMeta<typeof SecondaryButton>

const DefaultTemplate: ComponentStory<typeof SecondaryButton> = args => (
  <SecondaryButton {...args}>Default</SecondaryButton>
)

export const Default = DefaultTemplate.bind({})
