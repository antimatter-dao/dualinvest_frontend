import { ComponentStory, ComponentMeta } from '@storybook/react'

import SelectButton from 'components/Button/SelectButton'

export default {
  title: 'Button/SelectButton',
  component: SelectButton
} as ComponentMeta<typeof SelectButton>

const DefaultTemplate: ComponentStory<typeof SelectButton> = args => <SelectButton {...args}>Default</SelectButton>

export const Default = DefaultTemplate.bind({})
