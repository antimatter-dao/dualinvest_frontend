import { ComponentStory, ComponentMeta } from '@storybook/react'

import Spinner from 'components/Spinner'

export default {
  title: 'Others/Spinner',
  component: Spinner
} as ComponentMeta<typeof Spinner>

const DefaultTemplate: ComponentStory<typeof Spinner> = args => <Spinner {...args} />

export const Default = DefaultTemplate.bind({})
