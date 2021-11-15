import { ComponentMeta } from '@storybook/react'

import Tabs from 'components/Tabs/Tabs'

export default {
  title: 'Tabs/Tabs',
  component: Tabs
} as ComponentMeta<typeof Tabs>

export const Default = () => <Tabs tabContents={['Content 1', 'Content 2']} />
