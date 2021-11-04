import { MenuItem } from '@mui/material'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import PlainSelect from 'components/Select/PlainSelect'

export default {
  title: 'Input/PlainSelect',
  component: PlainSelect
} as ComponentMeta<typeof PlainSelect>

const DefaultTemplate: ComponentStory<typeof PlainSelect> = args => (
  <PlainSelect {...args} placeholder="about">
    <MenuItem key={'ETH'} value={'ETH'}>
      ETH
    </MenuItem>
    <MenuItem key={'BSC'} value={'BSC'}>
      BSC
    </MenuItem>
  </PlainSelect>
)

export const Default = DefaultTemplate.bind({})
