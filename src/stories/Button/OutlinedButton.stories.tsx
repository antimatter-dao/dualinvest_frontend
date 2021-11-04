import { ComponentStory, ComponentMeta } from '@storybook/react'

import OutlineButton from 'components/Button/OutlineButton'

export default {
  title: 'Button/OutlineButton',
  component: OutlineButton
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} as ComponentMeta<typeof OutlineButton>

const DefaultTemplate: ComponentStory<typeof OutlineButton> = args => (
  <OutlineButton {...args}>OutlineButon</OutlineButton>
)

export const Default = DefaultTemplate.bind({})

export const Primary = DefaultTemplate.bind({})
Primary.args = {
  primary: true
}
