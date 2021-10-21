import { ComponentStory, ComponentMeta } from '@storybook/react'

import SmallButton from 'components/Button/SmallButton'

export default {
  title: 'Button/SmallButton',
  component: SmallButton
} as ComponentMeta<typeof SmallButton>

const DefaultTemplate: ComponentStory<typeof SmallButton> = args => <SmallButton {...args}>Default</SmallButton>

export const Default = DefaultTemplate.bind({})
