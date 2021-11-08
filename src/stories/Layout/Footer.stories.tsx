import { ComponentMeta } from '@storybook/react'
import FooterComponent from 'components/Footer'

export default {
  title: 'Layout/Footer',
  component: FooterComponent
} as ComponentMeta<typeof FooterComponent>

export const Footer = () => {
  return <FooterComponent />
}
