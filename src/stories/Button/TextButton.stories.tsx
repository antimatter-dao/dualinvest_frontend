import { ComponentStory, ComponentMeta } from '@storybook/react'

import TextButton from 'components/Button/TextButton'

export default {
  title: 'Button/TextButton',
  component: TextButton
} as ComponentMeta<typeof TextButton>

const DefaultTemplate: ComponentStory<typeof TextButton> = args => <TextButton {...args}>Default</TextButton>

export const Default = DefaultTemplate.bind({})
