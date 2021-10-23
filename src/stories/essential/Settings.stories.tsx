import { ComponentMeta } from '@storybook/react'
import Settings from 'components/essential/Settings'

export default {
  title: 'Essential/Settings',
  component: Settings
} as ComponentMeta<typeof Settings>

export const Default = () => {
  return <Settings />
}
