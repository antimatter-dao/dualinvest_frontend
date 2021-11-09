import { ComponentStory, ComponentMeta } from '@storybook/react'

import Input from 'components/Input'
import { useState } from 'react'

export default {
  title: 'Input/Input',
  component: Input
} as ComponentMeta<typeof Input>

const DefaultTemplate: ComponentStory<typeof Input> = args => {
  const [val, setVal] = useState('')
  return <Input {...args} value={val} onChange={e => setVal(e.target.value)} placeholder="placeholder" />
}

export const Default = DefaultTemplate.bind({})

export const With_label = DefaultTemplate.bind({})
With_label.args = { label: 'Default' }

export const Outlined = DefaultTemplate.bind({})
Outlined.args = { outlined: true }

export const Disabled = DefaultTemplate.bind({})
Disabled.args = { disabled: true }

export const Focused = DefaultTemplate.bind({})
Focused.args = { focused: true }
