import { ComponentMeta } from '@storybook/react'
import AppBody from 'components/AppBody'

export default {
  title: 'AppBody/AppBody',
  component: AppBody
} as ComponentMeta<typeof AppBody>

export const Default = () => {
  return (
    <AppBody>
      <div style={{ padding: 24, width: '100%' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>
    </AppBody>
  )
}
