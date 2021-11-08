import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MenuItem } from '@mui/material'
import Select from 'components/Select/Select'

export default {
  title: 'Input/Select',
  component: Select
} as ComponentMeta<typeof Select>

const DefaultTemplate: ComponentStory<typeof Select> = args => (
  <Select {...args} placeholder="select" label="label">
    <MenuItem key={'ETH'} value={'ETH'}>
      ETH
    </MenuItem>
    <MenuItem key={'BSC'} value={'BSC'}>
      BSC
    </MenuItem>
  </Select>
)
export const Default = DefaultTemplate.bind({})
export const Primary = DefaultTemplate.bind({})
Primary.args = {
  primary: true
}
