import { ComponentStory, ComponentMeta } from '@storybook/react'

import Image from 'components/Image'

export default {
  title: 'Input/Image',
  component: Image
} as ComponentMeta<typeof Image>

const DefaultTemplate: ComponentStory<typeof Image> = args => <Image {...args} src="./favicon.png" />

export const Default = DefaultTemplate.bind({})
