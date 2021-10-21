import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReactComponent as Copy } from 'assets/componentsIcon/copy_icon.svg'

import LogoText from 'components/LogoText'

export default {
  title: 'Input/LogoText',
  component: LogoText
} as ComponentMeta<typeof LogoText>

const DefaultTemplate: ComponentStory<typeof LogoText> = args => <LogoText {...args} />

export const LogoIsString = DefaultTemplate.bind({})
LogoIsString.args = {
  logo: './favicon.png',
  text: 'placeholder'
}

export const LogoIsJSX = DefaultTemplate.bind({})
LogoIsJSX.args = {
  logo: <Copy />,
  text: 'placeholder'
}
