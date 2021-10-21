import { ComponentStory, ComponentMeta } from '@storybook/react'

import Input from 'components/Input'

export default {
  title: 'Input/Input',
  component: Input
} as ComponentMeta<typeof Input>

const DefaultTemplate: ComponentStory<typeof Input> = args => <Input {...args} />

export const Default = DefaultTemplate.bind({})

export const With_label = DefaultTemplate.bind({})
With_label.args = { label: 'Default' }

export const Outlined = DefaultTemplate.bind({})
Outlined.args = { outlined: true }
