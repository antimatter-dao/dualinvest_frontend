import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MenuItem } from '@mui/material'
import Select from 'components/Select/Select'
import { ReactComponent as CurrencyLogo } from 'assets/svg/eth_logo.svg'
import LogoText from 'components/LogoText/index'

export default {
  title: 'Input/Select',
  component: Select
} as ComponentMeta<typeof Select>

const DefaultTemplate: ComponentStory<typeof Select> = args => (
  <Select {...args} placeholder="select" label="label">
    <MenuItem key={'ETH'} value={'ETH'}>
      <LogoText logo={<CurrencyLogo />} text="ETH" />
    </MenuItem>
    <MenuItem key={'BSC'} value={'BSC'}>
      <LogoText logo={<CurrencyLogo />} text="BSC" />
    </MenuItem>
  </Select>
)
export const Default = DefaultTemplate.bind({})
export const Primary = DefaultTemplate.bind({})
Primary.args = {
  primary: true
}
