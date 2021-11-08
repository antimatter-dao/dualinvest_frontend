import { ComponentMeta } from '@storybook/react'
import { HashRouter } from 'react-router-dom'
import HeaderComponent from 'components/Header'

export default {
  title: 'Header/Header',
  component: HeaderComponent,
  decorators: [
    Story => {
      return (
        <HashRouter>
          <Story />
        </HashRouter>
      )
    }
  ]
} as ComponentMeta<typeof HeaderComponent>

export const Default = () => {
  return <HeaderComponent />
}
