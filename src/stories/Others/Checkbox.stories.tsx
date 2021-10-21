import { ComponentStory, ComponentMeta } from '@storybook/react'

import Checkbox from 'components/Checkbox'

export default {
  title: 'Others/Checkbox',
  component: Checkbox
} as ComponentMeta<typeof Checkbox>

const DefaultTemplate: ComponentStory<typeof Checkbox> = args => <Checkbox {...args} />

export const Default = DefaultTemplate.bind({})
Default.args = {
  label: 'Checkbox',
  checked: false
}
