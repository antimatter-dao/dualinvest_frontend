import { ComponentStory, ComponentMeta } from '@storybook/react'

import InputLabel from 'components/Input/InputLabel'

export default {
  title: 'Input/InputLabel',
  component: InputLabel
} as ComponentMeta<typeof InputLabel>

const DefaultTemplate: ComponentStory<typeof InputLabel> = args => <InputLabel {...args}>Default</InputLabel>

export const Default = DefaultTemplate.bind({})
Default.args = {
  infoIcon: false
}

export const InfoIcon = DefaultTemplate.bind({})
InfoIcon.args = {
  infoIcon: true
}
