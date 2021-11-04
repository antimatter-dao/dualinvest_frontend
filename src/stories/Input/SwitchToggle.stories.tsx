import { ComponentMeta } from '@storybook/react'

import SwitchToggle from 'components/SwitchToggle'
import { useState } from 'react'

export default {
  title: 'Others/SwitchToggle',
  component: SwitchToggle
} as ComponentMeta<typeof SwitchToggle>

export const Default = () => {
  const [checked, setChecked] = useState(false)
  return <SwitchToggle checked={checked} onChange={() => setChecked(prev => !prev)} />
}
