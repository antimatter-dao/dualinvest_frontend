import { ComponentStory, ComponentMeta } from '@storybook/react'

import Copy from 'components/essential/Copy'

export default {
  title: 'essential/Copy',
  component: Copy
} as ComponentMeta<typeof Copy>

const DefaultTemplate: ComponentStory<typeof Copy> = args => <Copy {...args} />

export const Default = DefaultTemplate.bind({})
Default.args = {
  toCopy: 'default'
}
