import { ComponentStory, ComponentMeta } from '@storybook/react'

import Divider from 'components/Divider'

export default {
  title: 'Others/Divider',
  component: Divider
} as ComponentMeta<typeof Divider>

const DefaultTemplate: ComponentStory<typeof Divider> = args => <Divider {...args} />

export const Default = DefaultTemplate.bind({})
