import { ComponentMeta } from '@storybook/react'

import { OutlinedCard } from 'components/Card'

export default {
  title: 'Others/OutlinedCard',
  component: OutlinedCard
} as ComponentMeta<typeof OutlinedCard>

export const Default = (args: any) => (
  <OutlinedCard {...args}>
    <ol>
      <li>Default</li>
      <li>Default</li>
      <li>Default</li>
    </ol>
  </OutlinedCard>
)
