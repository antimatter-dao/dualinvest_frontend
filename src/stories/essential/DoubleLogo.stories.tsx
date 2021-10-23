import { ComponentMeta } from '@storybook/react'
import DoubleLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { ETHER } from 'constants/token'

export default {
  title: 'Essential/DoubleLogo',
  component: DoubleLogo
} as ComponentMeta<typeof DoubleLogo>

export const Default = () => {
  return <DoubleLogo currency0={ETHER} currency1={ETHER} />
}
