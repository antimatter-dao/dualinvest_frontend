import { MenuItem } from '@material-ui/core'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import OutlineSelect from 'components/Select/OutlineSelect'

export default {
  title: 'Input/OutlineSelect',
  component: OutlineSelect
} as ComponentMeta<typeof OutlineSelect>

const DefaultTemplate: ComponentStory<typeof OutlineSelect> = args => (
  <OutlineSelect {...args}>
    <MenuItem key={'ETH'} value={'ETH'}>
      ETH
    </MenuItem>
    <MenuItem key={'BSC'} value={'BSC'}>
      BSC
    </MenuItem>
  </OutlineSelect>
)

export const Default = DefaultTemplate.bind({})
