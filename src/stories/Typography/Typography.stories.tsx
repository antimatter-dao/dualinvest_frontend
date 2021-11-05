import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Typography as MuiTypography } from '@mui/material'

function Typography(args: any) {
  return <MuiTypography {...args} />
}

export default {
  title: 'Typography/Typography',
  component: Typography
} as ComponentMeta<typeof MuiTypography>

const DefaultTemplate: ComponentStory<typeof Typography> = ({ children, ...args }: any) => (
  <Typography {...args}>{children ?? 'Default    fontSize: 16px, fontFamily: Roboto'}</Typography>
)

export const Default = DefaultTemplate.bind({})

export const h5 = DefaultTemplate.bind({})
h5.args = {
  variant: 'h5',
  children: 'fontSize: 28, fontFamily: Futura PT'
}

export const h6 = DefaultTemplate.bind({})
h6.args = {
  variant: 'h6',
  children: 'fontSize: 22, fontFamily: Futura PT'
}
export const body1 = DefaultTemplate.bind({})
body1.args = {
  variant: 'body1',
  children: 'fontSize: 14'
}
export const body2 = DefaultTemplate.bind({})
body2.args = {
  variant: 'body2',
  children: 'fontSize: 12'
}
export const caption = DefaultTemplate.bind({})
caption.args = {
  variant: 'caption',
  children: 'fontSize: 12, color: theme.textColor.text3'
}
