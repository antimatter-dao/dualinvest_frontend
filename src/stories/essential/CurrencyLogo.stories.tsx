import { ComponentMeta } from '@storybook/react'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ETHER } from 'constants/token'

export default {
  title: 'Essential/CurrencyLogo',
  component: CurrencyLogo
} as ComponentMeta<typeof CurrencyLogo>

export const Default = () => {
  return <CurrencyLogo currency={ETHER} />
}
