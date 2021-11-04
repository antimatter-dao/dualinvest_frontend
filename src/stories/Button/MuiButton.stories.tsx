import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button as MuiButton } from '@mui/material'

function Button(args: any) {
  return <MuiButton {...args} />
}

export default {
  title: 'Button/MuiButton',
  component: Button
} as ComponentMeta<typeof Button>

const DefaultTemplate: ComponentStory<typeof Button> = args => {
  return <Button {...args}>Mui Button</Button>
}

export const Default = DefaultTemplate.bind({})

export const Primary = DefaultTemplate.bind({})
Primary.args = {
  color: 'primary',
  variant: 'contained'
}

export const Secondary = DefaultTemplate.bind({})
Secondary.args = {
  color: 'secondary',
  variant: 'contained'
}

export const Outlined = DefaultTemplate.bind({})
Outlined.args = {
  variant: 'outlined'
}
export const OutlinedPrimary = DefaultTemplate.bind({})
OutlinedPrimary.args = {
  variant: 'outlined',
  color: 'primary'
}

export const Text = DefaultTemplate.bind({})
Text.args = {
  variant: 'text'
}

export const PrimaryText = DefaultTemplate.bind({})
PrimaryText.args = {
  color: 'primary',
  variant: 'text'
}

export const SecondaryText = DefaultTemplate.bind({})
SecondaryText.args = {
  color: 'secondary',
  variant: 'text'
}
