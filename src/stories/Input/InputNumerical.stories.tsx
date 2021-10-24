import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'
import InputNumerical from 'components/Input/InputNumerical'

export default {
  title: 'Input/InputNumerical',
  component: InputNumerical
} as ComponentMeta<typeof InputNumerical>

const DefaultTemplate: ComponentStory<typeof InputNumerical> = (args: any) => {
  const [val, setVal] = useState('')
  return (
    <InputNumerical
      {...args}
      value={val}
      onChange={e => {
        setVal(e.target.value)
      }}
    />
  )
}

export const Default = DefaultTemplate.bind({})

export const With_label = DefaultTemplate.bind({})
With_label.args = { label: 'Default' }

export const Outlined = DefaultTemplate.bind({})
Outlined.args = { outlined: true }

export const Disabled = DefaultTemplate.bind({})
Outlined.args = { disabled: true }

export const Focused = DefaultTemplate.bind({})
Outlined.args = { focused: true }
