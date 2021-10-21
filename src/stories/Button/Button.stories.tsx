import { ComponentStory, ComponentMeta } from '@storybook/react'

import Button from 'components/Button/Button'

export default {
  title: 'Button/Button',
  component: Button
} as ComponentMeta<typeof Button>

const DefaultTemplate: ComponentStory<typeof Button> = args => <Button {...args}>Default</Button>

export const Default = DefaultTemplate.bind({})
