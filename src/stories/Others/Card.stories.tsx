import { ComponentStory, ComponentMeta } from '@storybook/react'

import { OutlinedCard } from 'components/Card'

export default {
  title: 'Others/OutlinedCard',
  component: OutlinedCard
} as ComponentMeta<typeof OutlinedCard>

const DefaultTemplate: ComponentStory<typeof OutlinedCard> = args => (
  <OutlinedCard {...args}>
    <ol>
      <li>Default</li>
      <li>Default</li>
      <li>Default</li>
    </ol>
  </OutlinedCard>
)

export const Default = DefaultTemplate.bind({})
